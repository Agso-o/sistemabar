package br.com.sistemabar.sistemabar.service;

import br.com.sistemabar.sistemabar.dto.ExtratoDTO;
import br.com.sistemabar.sistemabar.dto.ItemConsumidoDTO;
import br.com.sistemabar.sistemabar.model.*;
import br.com.sistemabar.sistemabar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConsultaService {

    @Autowired private ComandaRepository comandaRepository;
    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private PagamentoRepository pagamentoRepository;
    @Autowired private ConfiguracaoRepository configuracaoRepository;

    // Lógica para gerar o DTO do 'cliente.js'
    public ExtratoDTO gerarExtrato(Long comandaId) {
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new RuntimeException("Comanda não encontrada"));

        Configuracao config = configuracaoRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Configurações do sistema não encontradas"));

        List<Pedido> pedidos = pedidoRepository.findByComandaAndStatus(comanda, StatusPedido.ATIVO);
        List<Pagamento> pagamentos = pagamentoRepository.findByComanda(comanda);

        double subtotalComida = 0;
        double subtotalBebida = 0;
        double gorjetaComida = 0;
        double gorjetaBebida = 0;

        List<ItemConsumidoDTO> itensDTO = new ArrayList<>();

        for (Pedido p : pedidos) {
            double valorPedido = p.getPrecoUnitarioSnapshot() * p.getQuantidade();
            itensDTO.add(new ItemConsumidoDTO(p.getId(), p.getItem().getNome(), p.getQuantidade(), valorPedido));

            if (p.getItem().getTipo() == 2) { // Bebida
                subtotalBebida += valorPedido;
                gorjetaBebida += valorPedido * config.getPercentualGorjetaBebida();
            } else if (p.getItem().getTipo() == 3) { // Comida
                subtotalComida += valorPedido;
                gorjetaComida += valorPedido * config.getPercentualGorjetaComida();
            }
        }

        double couvert = comanda.getValorCouvertAplicado();
        double gorjetaTotal = gorjetaBebida + gorjetaComida;
        double totalPago = pagamentos.stream().mapToDouble(Pagamento::getValor).sum();
        double totalBruto = subtotalComida + subtotalBebida + couvert + gorjetaTotal;
        double saldoDevedor = totalBruto - totalPago;

        return new ExtratoDTO(
                comandaId,
                comanda.getMesa().getNumero(),
                comanda.getStatus().toString(),
                itensDTO,
                subtotalComida,
                subtotalBebida,
                couvert,
                gorjetaTotal,
                totalPago,
                (Math.round(saldoDevedor * 100.0) / 100.0) // Arredonda
        );
    }
}