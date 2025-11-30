package br.com.sistemabar.sistemabar.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mesas")
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // unique=true garante que não teremos duas mesas com o mesmo número
    @Column(nullable = false, unique = true)
    private int numero;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusMesa status;

    // --- Construtores ---
    public Mesa() {
    }

    public Mesa(int numero) {
        this.numero = numero;
        this.status = StatusMesa.FECHADA; // <--- Nasce FECHADA por padrão
    }

    // --- Getters e Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public StatusMesa getStatus() {
        return status;
    }

    public void setStatus(StatusMesa status) {
        this.status = status;
    }
}