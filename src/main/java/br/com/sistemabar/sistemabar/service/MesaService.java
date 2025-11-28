package br.com.sistemabar.sistemabar.service;

import br.com.sistemabar.sistemabar.model.*;
import br.com.sistemabar.sistemabar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Importante

import java.util.List;
import java.util.Optional;

@Service // Marca a classe como um Serviço do Spring
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


    @Transactional // Garante que ou tudo funciona, ou nada é salvo no banco
    public Comanda abrirMesa(int numeroMesa, int pessoas) {
        //  Encontra a mesa pelo número
        Mesa mesa = mesaRepository.findByNumero(numeroMesa);
        if (mesa == null) {
            throw new RuntimeException("Mesa não encontrada: " + numeroMesa);
        }

        // Validação da regra de negócio
        if (mesa.getStatus() == StatusMesa.OCUPADA) {
            throw new RuntimeException("Mesa já está ocupada");
        }

        // Muda o estado da mesa
        mesa.setStatus(StatusMesa.OCUPADA);
        mesaRepository.save(mesa); // Salva a atualização da mesa

        // Cria a nova comanda associada a esta mesa
        Comanda novaComanda = new Comanda(mesa, pessoas);
        return comandaRepository.save(novaComanda); // Salva e retorna a nova comanda
    }

    @Transactional
    public Pedido adicionarPedido(Long comandaId, Long itemId, int quantidade) {

        // Validação básica
        if (quantidade <= 0) {
            throw new RuntimeException("A quantidade deve ser maior que zero.");
        }

        // Busca a comanda no banco
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada: " + comandaId));

        // Regra de Negócio: Não pode adicionar pedido em comanda fechada
        if (comanda.getStatus() != StatusComanda.ABERTA) {
            throw new RuntimeException("Não é possível adicionar pedido. A comanda já está fechada.");
        }

        ItemCardapio item = itemCardapioRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item do cardápio não encontrado: " + itemId));

        // Cria o novo objeto Pedido
        // (O construtor do Pedido já salva o "snapshot" do preço)
        Pedido novoPedido = new Pedido(comanda, item, quantidade);

        // Salva o novo pedido no banco
        return pedidoRepository.save(novoPedido);
    }

    public double calcularTotalRestanteComanda(Long comandaId) {
        // 1. Busca a comanda
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada: " + comandaId));

        // 2. Busca as configurações de gorjeta/couvert (Sempre ID=1)
        Configuracao config = configuracaoRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Configurações do sistema não encontradas"));

        // 3. Busca todos os pedidos ATIVOS da comanda
        List<Pedido> pedidosAtivos = pedidoRepository.findByComandaAndStatus(comanda, StatusPedido.ATIVO);

        // 4. Inicializa os totais
        double subtotalItens = 0;
        double gorjetaBebida = 0;
        double gorjetaComida = 0;

        // 5. Itera pelos pedidos e calcula o subtotal + gorjetas
        //    (Esta é a lógica migrada do seu Bar.java antigo)
        for (Pedido pedido : pedidosAtivos) {
            // Calcula o subtotal deste pedido
            double precoPedido = pedido.getPrecoUnitarioSnapshot() * pedido.getQuantidade();
            subtotalItens += precoPedido;

            // Pega o tipo de item (2=bebida, 3=comida)
            int tipoItem = pedido.getItem().getTipo();

            // Aplica a gorjeta DINÂMICA (vinda do banco)
            if (tipoItem == 2) { // Bebida
                gorjetaBebida += precoPedido * config.getPercentualGorjetaBebida();
            } else if (tipoItem == 3) { // Comida
                gorjetaComida += precoPedido * config.getPercentualGorjetaComida();
            }
            // (Itens tipo 0 ou 1, como Ingresso, não ganham gorjeta)
        }

        // 6. Busca o valor do couvert (se foi aplicado pelo garçom)
        double valorCouvert = comanda.getValorCouvertAplicado();

        // 7. Soma o total PAGO
        List<Pagamento> pagamentos = pagamentoRepository.findByComanda(comanda);
        double totalPago = pagamentos.stream()
                .mapToDouble(Pagamento::getValor)
                .sum();

        // 8. Cálculo Final
        double totalBruto = subtotalItens + gorjetaBebida + gorjetaComida + valorCouvert;
        double totalRestante = totalBruto - totalPago;

        // Arredonda para 2 casas decimais para evitar problemas com double
        return Math.round(totalRestante * 100.0) / 100.0;
    }

    @Transactional
    public Pedido cancelarPedido(Long pedidoId, String motivo) {
        // 1. Validação do motivo
        if (motivo == null || motivo.isBlank()) {
            throw new RuntimeException("É obrigatório fornecer um motivo para o cancelamento.");
        }

        // 2. Busca o pedido específico
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + pedidoId));

        // 3. Regra de Negócio: Não pode cancelar pedido de comanda já fechada
        if (pedido.getComanda().getStatus() != StatusComanda.ABERTA) {
            throw new RuntimeException("Não é possível cancelar. A comanda já está fechada.");
        }

        // 4. Regra de Negócio: Não cancelar algo já cancelado
        if (pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new RuntimeException("Este pedido já foi cancelado.");
        }

        // 5. Aplica o cancelamento
        pedido.setStatus(StatusPedido.CANCELADO);
        pedido.setMotivoCancelamento(motivo);

        // 6. Salva a alteração no banco
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pagamento registrarPagamento(Long comandaId, double valor) {
        // 1. Validação do valor
        if (valor <= 0) {
            throw new RuntimeException("O valor do pagamento deve ser maior que zero.");
        }

        // 2. Busca a comanda
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada: " + comandaId));

        // 3. Regra de Negócio: Só pode pagar comanda aberta
        if (comanda.getStatus() != StatusComanda.ABERTA) {
            throw new RuntimeException("Esta comanda já foi fechada.");
        }

        // 4. Calcula o valor que AINDA FALTA pagar
        double totalRestante = calcularTotalRestanteComanda(comandaId);

        // 5. Regra de Negócio: Não pode pagar mais do que deve
        //    (Usamos uma pequena margem para erros de 'double')
        if (valor > (totalRestante + 0.001)) {
            throw new RuntimeException("Pagamento maior que o valor restante. Restam: R$ " + totalRestante);
        }

        // 6. Cria o novo objeto Pagamento
        Pagamento novoPagamento = new Pagamento(comanda, valor);

        // 7. Salva o pagamento no banco
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
        
        // Verifica se a conta está paga (com margem de erro para double)
        if (totalRestante > 0.01) {
            throw new RuntimeException("A conta não pode ser fechada. Saldo devedor: R$ " + totalRestante);
        }

        comanda.setStatus(StatusComanda.FECHADA);
        // comanda.setDataFechamento(LocalDateTime.now()); // Se tiver esse campo
        comandaRepository.save(comanda);

        Mesa mesa = comanda.getMesa();
        mesa.setStatus(StatusMesa.LIVRE);
        mesaRepository.save(mesa);

        return comanda;
    }

}
