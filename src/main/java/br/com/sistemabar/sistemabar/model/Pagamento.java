package br.com.sistemabar.sistemabar.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagamentos")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Relacionamento ---
    // Muitos Pagamentos podem ser feitos em UMA Comanda
    @ManyToOne
    @JoinColumn(name = "comanda_id", nullable = false)
    private Comanda comanda;

    @Column(nullable = false)
    private double valor;

    @Column(name = "data_pagamento", nullable = false)
    private LocalDateTime dataPagamento;

    // --- Construtores ---
    public Pagamento() {
        // Construtor vazio para o JPA
    }

    // Construtor para "Registrar Pagamento"
    public Pagamento(Comanda comanda, double valor) {
        this.comanda = comanda;
        this.valor = valor;
        this.dataPagamento = LocalDateTime.now();
    }

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Comanda getComanda() {
        return comanda;
    }

    public void setComanda(Comanda comanda) {
        this.comanda = comanda;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }
}