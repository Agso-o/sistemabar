package br.com.sistemabar.sistemabar.service;

import br.com.sistemabar.sistemabar.model.*;
import br.com.sistemabar.sistemabar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        Mesa mesa = mesaRepository.findByNumero(numeroMesa);
        if (mesa == null) {
            throw new RuntimeException("Mesa não encontrada: " + numeroMesa);
        }

        if (mesa.getStatus() == StatusMesa.ABERTA) {
            throw new RuntimeException("Mesa já está ABERTA (Ocupada)");
        }

        mesa.setStatus(StatusMesa.ABERTA);
        mesaRepository.save(mesa);

        Comanda novaComanda = new Comanda(mesa, pessoas);
        return comandaRepository.save(novaComanda);
    }

    @Transactional
    public Pedido adicionarPedido(Long comandaId, Long itemId, int quantidade) {
        if (quantidade <= 0) {
            throw new RuntimeException("A quantidade deve ser maior que zero.");
        }

        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada: " + comandaId));

        if (comanda.getStatus() != StatusComanda.ABERTA) {
            throw new RuntimeException("Não é possível adicionar pedido. A comanda já está fechada.");
        }

        ItemCardapio item = itemCardapioRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item do cardápio não encontrado: " + itemId));

        Pedido novoPedido = new Pedido(comanda, item, quantidade);
        return pedidoRepository.save(novoPedido);
    }

    public double calcularTotalRestanteComanda(Long comandaId) {
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada: " + comandaId));

        Configuracao config = configuracaoRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Configurações do sistema não encontradas"));

        List<Pedido> pedidosAtivos = pedidoRepository.findByComandaAndStatus(comanda, StatusPedido.ATIVO);

        double subtotalItens = 0;
        double gorjetaBebida = 0;
        double gorjetaComida = 0;

        for (Pedido pedido : pedidosAtivos) {
            double precoPedido = pedido.getPrecoUnitarioSnapshot() * pedido.getQuantidade();
            subtotalItens += precoPedido;

            int tipoItem = pedido.getItem().getTipo();

            if (tipoItem == 2) { // Bebida
                gorjetaBebida += precoPedido * config.getPercentualGorjetaBebida();
            } else if (tipoItem == 3) { // Comida
                gorjetaComida += precoPedido * config.getPercentualGorjetaComida();
            }
        }

        double valorCouvert = comanda.getValorCouvertAplicado();

        List<Pagamento> pagamentos = pagamentoRepository.findByComanda(comanda);
        double totalPago = pagamentos.stream()
                .mapToDouble(Pagamento::getValor)
                .sum();

        double totalBruto = subtotalItens + gorjetaBebida + gorjetaComida + valorCouvert;
        double totalRestante = totalBruto - totalPago;

        return Math.round(totalRestante * 100.0) / 100.0;
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

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pagamento registrarPagamento(Long comandaId, double valor) {
        if (valor <= 0) {
            throw new RuntimeException("O valor do pagamento deve ser maior que zero.");
        }

        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada: " + comandaId));

        if (comanda.getStatus() != StatusComanda.ABERTA) {
            throw new RuntimeException("Esta comanda já foi fechada.");
        }

        double totalRestante = calcularTotalRestanteComanda(comandaId);

        if (valor > (totalRestante + 0.01)) {
            throw new RuntimeException("Pagamento maior que o valor restante. Restam: R$ " + totalRestante);
        }

        Pagamento novoPagamento = new Pagamento(comanda, valor);
        return pagamentoRepository.save(novoPagamento);
    }

    @Transactional
    public Comanda fecharComanda(Long comandaId) {
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada: " + comandaId));

        if (comanda.getStatus() == StatusComanda.FECHADA) {
            throw new RuntimeException("Esta comanda já foi fechada.");
        }

        double totalRestante = calcularTotalRestanteComanda(comandaId);

        if (totalRestante > 0.01) {
            throw new RuntimeException("A conta não pode ser fechada. Saldo devedor: R$ " + totalRestante);
        }

        comanda.setStatus(StatusComanda.FECHADA);
        comandaRepository.save(comanda);

        // Libera a mesa (Volta para o status FECHADA)
        Mesa mesa = comanda.getMesa();
        mesa.setStatus(StatusMesa.FECHADA);
        mesaRepository.save(mesa);

        return comanda;
    }
}