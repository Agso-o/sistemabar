package br.com.sistemabar.sistemabar.service;

import br.com.sistemabar.sistemabar.dto.ItemMaiorFaturamentoDTO;
import br.com.sistemabar.sistemabar.dto.ItemMaisVendidoDTO;
import br.com.sistemabar.sistemabar.repository.PagamentoRepository;
import br.com.sistemabar.sistemabar.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RelatorioService {

    private final PedidoRepository pedidoRepository;
    private final PagamentoRepository pagamentoRepository;

    @Autowired
    public RelatorioService(PedidoRepository pedidoRepository,
                            PagamentoRepository pagamentoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.pagamentoRepository = pagamentoRepository;
    }

    /**
     * Calcula o faturamento total (soma de pagamentos) em um período.
     */
    public Double getFaturamentoPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return pagamentoRepository.sumValorByDataPagamentoBetween(inicio, fim);
    }

    /**
     * Busca os itens mais vendidos, ordenados.
     */
    public List<ItemMaisVendidoDTO> getItensMaisVendidos() {
        return pedidoRepository.findItensMaisVendidos();
    }

    /**
     * Busca os itens que geraram maior faturamento, ordenados.
     */
    public List<ItemMaiorFaturamentoDTO> getItensMaiorFaturamento() {
        return pedidoRepository.findItensMaiorFaturamento();
    }
}