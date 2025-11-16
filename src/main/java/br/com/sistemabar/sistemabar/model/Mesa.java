package br.com.sistemabar.sistemabar.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mesas")
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // O número da mesa (Mesa 1, Mesa 2, etc.)
    // unique=true garante que não teremos duas mesas "Número 5"
    @Column(nullable = false, unique = true)
    private int numero;

    // Diz ao JPA para salvar o Enum como String ("LIVRE", "OCUPADA")
    // em vez de um número (0, 1)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusMesa status;

    // --- Construtores ---
    public Mesa() {
        // Construtor vazio para o JPA
    }

    public Mesa(int numero) {
        this.numero = numero;
        this.status = StatusMesa.LIVRE; // Toda mesa nova começa livre
    }

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