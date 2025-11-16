package br.com.sistemabar.sistemabar.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comandas")
public class Comanda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Relacionamento ---
    // @ManyToOne: Muitas comandas podem estar em UMA mesa (ao longo do tempo)
    // @JoinColumn: Especifica a chave estrangeira 'mesa_id'
    @ManyToOne
    @JoinColumn(name = "mesa_id", nullable = false)
    private Mesa mesa;

    @Column(nullable = false)
    private int pessoas; // Nº de pessoas (para calcular o couvert)

    @Column(name = "valor_couvert_aplicado")
    private double valorCouvertAplicado; // Valor total do couvert

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusComanda status;

    @Column(name = "data_abertura", nullable = false)
    private LocalDateTime dataAbertura;

    @Column(name = "data_fechamento")
    private LocalDateTime dataFechamento;

    // --- Construtores ---
    public Comanda() {
        // Construtor vazio para o JPA
    }

    // Construtor para "Abrir a conta"
    public Comanda(Mesa mesa, int pessoas) {
        this.mesa = mesa;
        this.pessoas = pessoas;
        this.status = StatusComanda.ABERTA;
        this.dataAbertura = LocalDateTime.now();
        this.valorCouvertAplicado = 0; // Couvert é aplicado depois pelo garçom
    }

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mesa getMesa() {
        return mesa;
    }

    public void setMesa(Mesa mesa) {
        this.mesa = mesa;
    }

    public int getPessoas() {
        return pessoas;
    }

    public void setPessoas(int pessoas) {
        this.pessoas = pessoas;
    }

    public double getValorCouvertAplicado() {
        return valorCouvertAplicado;
    }

    public void setValorCouvertAplicado(double valorCouvertAplicado) {
        this.valorCouvertAplicado = valorCouvertAplicado;
    }

    public StatusComanda getStatus() {
        return status;
    }

    public void setStatus(StatusComanda status) {
        this.status = status;
    }

    public LocalDateTime getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDateTime dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public LocalDateTime getDataFechamento() {
        return dataFechamento;
    }

    public void setDataFechamento(LocalDateTime dataFechamento) {
        this.dataFechamento = dataFechamento;
    }
}