package br.com.sistemabar.sistemabar.dto;

// Este DTO vai carregar o resultado de "Itens mais vendidos"
public class ItemMaisVendidoDTO {
    private String nomeItem;
    private Long totalVendido;

    public ItemMaisVendidoDTO(String nomeItem, Long totalVendido) {
        this.nomeItem = nomeItem;
        this.totalVendido = totalVendido;
    }

    // Getters
    public String getNomeItem() { return nomeItem; }
    public Long getTotalVendido() { return totalVendido; }
}
