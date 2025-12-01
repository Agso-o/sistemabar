package br.com.sistemabar.sistemabar.service;

import br.com.sistemabar.sistemabar.dto.PagamentoResponseDTO;
import br.com.sistemabar.sistemabar.model.*;
import br.com.sistemabar.sistemabar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MesaService {

    private final MesaRepository mesaRepository;
    private final ComandaRepository comandaRepository;
    private final ItemCardapioRepository itemCardapioRepository;
    private final PedidoRepository pedidoRepository;
    private final PagamentoRepository pagamentoRepository;
    private final ConfiguracaoRepository configuracaoRepository;

    @Autowired
    public MesaService(MesaRepository mesaRepository,
                       ComandaRepository comandaRepository,
                       ItemCardapioRepository itemCardapioRepository,
                       PedidoRepository pedidoRepository, PagamentoRepository pagamentoRepository, ConfiguracaoRepository configuracaoRepository) {
        this.mesaRepository = mesaRepository;
        this.comandaRepository = comandaRepository;
        this.itemCardapioRepository = itemCardapioRepository;
        this.pedidoRepository = pedidoRepository;
        this.pagamentoRepository = pagamentoRepository;
        this.configuracaoRepository = configuracaoRepository;
    }

    @Transactional
    public Comanda abrirMesa(int numeroMesa, int pessoas) {
        if (pessoas <= 0) throw new RuntimeException("A mesa deve ser iniciada com pelo menos 1 pessoa.");

        Mesa mesa = mesaRepository.findByNumero(numeroMesa);
        if (mesa == null) throw new RuntimeException("Mesa não encontrada: " + numeroMesa);
        if (mesa.getStatus() == StatusMesa.ABERTA) throw new RuntimeException("Mesa já está ABERTA");

        mesa.setStatus(StatusMesa.ABERTA);
        mesaRepository.save(mesa);

        Comanda novaComanda = new Comanda(mesa, pessoas);

        // Couvert Automático
        Configuracao config = configuracaoRepository.findById(1L).orElse(new Configuracao());
        if (config.getValorCouvertPessoa() > 0) {
            double totalCouvert = config.getValorCouvertPessoa() * pessoas;
            novaComanda.setValorCouvertAplicado(totalCouvert);
        }

        return comandaRepository.save(novaComanda);
    }

    @Transactional
    public Comanda adicionarPessoasMesa(int numeroMesa, int quantidadeMais) {
        if (quantidadeMais <= 0) throw new RuntimeException("Quantidade inválida.");

        Mesa mesa = mesaRepository.findByNumero(numeroMesa);
        if (mesa == null) throw new RuntimeException("Mesa não encontrada.");

        Comanda comanda = comandaRepository.findByMesaAndStatus(mesa, StatusComanda.ABERTA)
                .orElseThrow(() -> new RuntimeException("Nenhuma comanda aberta na Mesa " + numeroMesa));

        comanda.setPessoas(comanda.getPessoas() + quantidadeMais);

        if (comanda.getValorCouvertAplicado() > 0) {
            Configuracao config = configuracaoRepository.findById(1L).orElse(new Configuracao());
            double novoTotalCouvert = config.getValorCouvertPessoa() * comanda.getPessoas();
            comanda.setValorCouvertAplicado(novoTotalCouvert);
        }

        return comandaRepository.save(comanda);
    }

    @Transactional
    public Comanda atualizarCouvertMesa(int numeroMesa, boolean cobrar) {
        Mesa mesa = mesaRepository.findByNumero(numeroMesa);
        if (mesa == null) throw new RuntimeException("Mesa não encontrada.");

        Comanda comanda = comandaRepository.findByMesaAndStatus(mesa, StatusComanda.ABERTA)
                .orElseThrow(() -> new RuntimeException("Nenhuma comanda aberta na Mesa " + numeroMesa));

        if (cobrar) {
            Configuracao config = configuracaoRepository.findById(1L).orElse(new Configuracao());
            double totalCouvert = config.getValorCouvertPessoa() * comanda.getPessoas();
            comanda.setValorCouvertAplicado(totalCouvert);
        } else {
            comanda.setValorCouvertAplicado(0.0);
        }

        return comandaRepository.save(comanda);
    }

    // --- CORREÇÃO AQUI: Força preço e status explicitamente ---
    @Transactional
    public Pedido adicionarPedido(int numeroMesa, int numeroItem, int quantidade) {
        if (quantidade <= 0) throw new RuntimeException("A quantidade deve ser maior que zero.");

        Mesa mesa = mesaRepository.findByNumero(numeroMesa);
        if (mesa == null) throw new RuntimeException("Mesa " + numeroMesa + " não encontrada.");

        if (mesa.getStatus() == StatusMesa.FECHADA) {
            throw new RuntimeException("A Mesa " + numeroMesa + " está FECHADA. Abra a mesa antes de adicionar itens.");
        }

        Optional<Comanda> comandaOpt = comandaRepository.findByMesaAndStatus(mesa, StatusComanda.ABERTA);
        Comanda comanda;

        if (comandaOpt.isEmpty()) {
            comanda = new Comanda(mesa, 1);
            comanda = comandaRepository.save(comanda);
        } else {
            comanda = comandaOpt.get();
        }

        ItemCardapio item = itemCardapioRepository.findByNumero(numeroItem)
                .orElseThrow(() -> new RuntimeException("Item código " + numeroItem + " não encontrado."));

        if (!item.isAtivo()) {
            throw new RuntimeException("Este item (" + item.getNome() + ") está inativo.");
        }

        // CRIA O PEDIDO E FORÇA OS VALORES
        Pedido novoPedido = new Pedido(comanda, item, quantidade);
        novoPedido.setPrecoUnitarioSnapshot(item.getPreco()); // Garante que o preço foi pego
        novoPedido.setStatus(StatusPedido.ATIVO); // Garante que está ativo

        return pedidoRepository.save(novoPedido);
    }

    @Transactional
    public Pedido cancelarPedido(Long pedidoId, String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new RuntimeException("É obrigatório fornecer um motivo para o cancelamento.");
        }

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + pedidoId));

        if (pedido.getComanda().getStatus() != StatusComanda.ABERTA) {
            throw new RuntimeException("Não é possível cancelar. A comanda já está fechada.");
        }

        if (pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new RuntimeException("Este pedido já foi cancelado.");
        }

        pedido.setStatus(StatusPedido.CANCELADO);
        pedido.setMotivoCancelamento(motivo);
        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        Comanda comanda = pedido.getComanda();
        double[] valores = calcularValoresComanda(comanda);
        double saldoRestante = valores[2];

        if (saldoRestante < -0.001) {
            Pagamento estorno = new Pagamento(comanda, saldoRestante);
            pagamentoRepository.save(estorno);
        }

        return pedidoSalvo;
    }

    private PagamentoResponseDTO montarResumoFinanceiro(Comanda comanda, double valorPagoAgora) {
        Configuracao config = configuracaoRepository.findById(1L).orElse(new Configuracao());

        // Busca apenas os pedidos ATIVOS
        List<Pedido> pedidos = pedidoRepository.findByComandaAndStatus(comanda, StatusPedido.ATIVO);

        double subtotalItens = 0;
        double valorGorjeta = 0;

        for (Pedido p : pedidos) {
            double valor = p.getPrecoUnitarioSnapshot() * p.getQuantidade();
            subtotalItens += valor;

            if (p.getItem().getTipo() == 2) { // Bebida
                valorGorjeta += valor * config.getPercentualGorjetaBebida();
            } else if (p.getItem().getTipo() == 3) { // Comida
                valorGorjeta += valor * config.getPercentualGorjetaComida();
            }
        }

        double valorCouvert = comanda.getValorCouvertAplicado();
        double totalBruto = subtotalItens + valorGorjeta + valorCouvert;

        List<Pagamento> pagamentos = pagamentoRepository.findByComandaOrderByIdAsc(comanda);
        double totalJaPago = pagamentos.stream().mapToDouble(Pagamento::getValor).sum();

        double saldoRestante = Math.round((totalBruto - totalJaPago) * 100.0) / 100.0;

        List<Double> historico = pagamentos.stream().map(Pagamento::getValor).collect(Collectors.toList());

        return new PagamentoResponseDTO(
                valorPagoAgora,
                subtotalItens,
                valorGorjeta,
                valorCouvert,
                totalBruto,
                totalJaPago,
                saldoRestante,
                historico
        );
    }

    private double[] calcularValoresComanda(Comanda comanda) {
        PagamentoResponseDTO dto = montarResumoFinanceiro(comanda, 0.0);
        return new double[]{dto.totalConta(), dto.totalJaPago(), dto.saldoRestante()};
    }

    public PagamentoResponseDTO consultarSaldoMesa(int numeroMesa) {
        Mesa mesa = mesaRepository.findByNumero(numeroMesa);
        if (mesa == null) throw new RuntimeException("Mesa não encontrada.");

        Comanda comanda = comandaRepository.findByMesaAndStatus(mesa, StatusComanda.ABERTA)
                .orElseThrow(() -> new RuntimeException("Nenhuma comanda aberta na Mesa " + numeroMesa));

        return montarResumoFinanceiro(comanda, 0.0);
    }

    @Transactional
    public PagamentoResponseDTO registrarPagamento(int numeroMesa, double valor) {
        if (valor <= 0) throw new RuntimeException("Valor inválido.");

        Mesa mesa = mesaRepository.findByNumero(numeroMesa);
        if (mesa == null) throw new RuntimeException("Mesa não encontrada.");

        Comanda comanda = comandaRepository.findByMesaAndStatus(mesa, StatusComanda.ABERTA)
                .orElseThrow(() -> new RuntimeException("Nenhuma comanda aberta na Mesa " + numeroMesa));

        PagamentoResponseDTO resumoAtual = montarResumoFinanceiro(comanda, 0.0);

        if (valor > (resumoAtual.saldoRestante() + 0.01)) {
            throw new RuntimeException("Valor excede o restante (R$ " + resumoAtual.saldoRestante() + ")");
        }

        Pagamento novoPagamento = new Pagamento(comanda, valor);
        pagamentoRepository.save(novoPagamento);

        return montarResumoFinanceiro(comanda, valor);
    }

    @Transactional
    public Comanda fecharComanda(int numeroMesa) {
        Mesa mesa = mesaRepository.findByNumero(numeroMesa);
        if (mesa == null) throw new RuntimeException("Mesa não encontrada.");

        Optional<Comanda> comandaOpt = comandaRepository.findByMesaAndStatus(mesa, StatusComanda.ABERTA);

        if (comandaOpt.isEmpty()) {
            if (mesa.getStatus() == StatusMesa.ABERTA) {
                mesa.setStatus(StatusMesa.FECHADA);
                mesaRepository.save(mesa);
                return null;
            }
            throw new RuntimeException("Mesa " + numeroMesa + " já está fechada.");
        }

        Comanda comanda = comandaOpt.get();
        PagamentoResponseDTO resumo = montarResumoFinanceiro(comanda, 0.0);

        if (resumo.saldoRestante() > 0.01) {
            throw new RuntimeException("Conta não paga. Saldo: R$ " + resumo.saldoRestante());
        }

        comanda.setStatus(StatusComanda.FECHADA);
        comandaRepository.save(comanda);

        mesa.setStatus(StatusMesa.FECHADA);
        mesaRepository.save(mesa);

        return comanda;
    }

    public double calcularTotalRestante(Comanda comanda) {
        return montarResumoFinanceiro(comanda, 0.0).saldoRestante();
    }
}