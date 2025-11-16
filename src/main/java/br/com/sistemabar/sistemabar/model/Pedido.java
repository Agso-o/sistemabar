package br.com.sistemabar.sistemabar.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comanda_id", nullable = false)
    private Comanda comanda;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private ItemCardapio item;

    @Column(nullable = false)
    private int quantidade;

    @Column(name = "preco_unitario_snapshot", nullable = false)
    private double precoUnitarioSnapshot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status; // Vai usar o Enum simplificado

    @Column(name = "motivo_cancelamento")
    private String motivoCancelamento; // Onde o garçom anota o motivo

    // --- Construtores ---
    public Pedido() {
        // JPA
    }

    public Pedido(Comanda comanda, ItemCardapio item, int quantidade) {
        this.comanda = comanda;
        this.item = item;
        this.quantidade = quantidade;
        this.precoUnitarioSnapshot = item.getPreco();
        this.status = StatusPedido.ATIVO; // <-- Alterado para ATIVO
    }

    // --- Getters e Setters ---
    // (Todos os getters e setters que já tínhamos)
    // ...

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Comanda getComanda() { return comanda; }
    public void setComanda(Comanda comanda) { this.comanda = comanda; }
    public ItemCardapio getItem() { return item; }
    public void setItem(ItemCardapio item) { this.item = item; }
    public int getQuantidade() { return quantidade; }
    public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
    public double getPrecoUnitarioSnapshot() { return precoUnitarioSnapshot; }
    public void setPrecoUnitarioSnapshot(double precoUnitarioSnapshot) { this.precoUnitarioSnapshot = precoUnitarioSnapshot; }
    public StatusPedido getStatus() { return status; }
    public void setStatus(StatusPedido status) { this.status = status; }
    public String getMotivoCancelamento() { return motivoCancelamento; }
    public void setMotivoCancelamento(String motivoCancelamento) { this.motivoCancelamento = motivoCancelamento; }
}