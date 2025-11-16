package br.com.sistemabar.sistemabar.dto;

// Este DTO vai carregar o resultado de "Itens com maior faturamento"
public class ItemMaiorFaturamentoDTO {
    private String nomeItem;
    private Double faturamentoTotal;

    public ItemMaiorFaturamentoDTO(String nomeItem, Double faturamentoTotal) {
        this.nomeItem = nomeItem;
        this.faturamentoTotal = faturamentoTotal;
    }

    // Getters
    public String getNomeItem() { return nomeItem; }
    public Double getFaturamentoTotal() { return faturamentoTotal; }
}