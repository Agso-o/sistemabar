package br.com.sistemabar.sistemabar.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "configuracoes")
public class Configuracao {

    @Id
    private Long id; // Sempre será 1

    @Column(name = "percentual_gorjeta_bebida", nullable = false)
    private double percentualGorjetaBebida;

    @Column(name = "percentual_gorjeta_comida", nullable = false)
    private double percentualGorjetaComida;

    @Column(name = "valor_couvert_pessoa", nullable = false)
    private double valorCouvertPessoa;

    public Configuracao() {}

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getPercentualGorjetaBebida() {
        return percentualGorjetaBebida;
    }

    public void setPercentualGorjetaBebida(double percentualGorjetaBebida) {
        this.percentualGorjetaBebida = percentualGorjetaBebida;
    }

    public double getPercentualGorjetaComida() {
        return percentualGorjetaComida;
    }

    public void setPercentualGorjetaComida(double percentualGorjetaComida) {
        this.percentualGorjetaComida = percentualGorjetaComida;
    }

    public double getValorCouvertPessoa() {
        return valorCouvertPessoa;
    }

    public void setValorCouvertPessoa(double valorCouvertPessoa) {
        this.valorCouvertPessoa = valorCouvertPessoa;
    }
}