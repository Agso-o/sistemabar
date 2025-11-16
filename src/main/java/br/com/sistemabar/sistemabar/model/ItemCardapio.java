package br.com.sistemabar.sistemabar.model;

import jakarta.persistence.*;
@Entity // 1. Diz ao Spring que esta classe é uma tabela no banco
@Table(name = "item_cardapio") // 2. Define o nome da tabela
public class ItemCardapio {

    @Id // 3. Marca este campo como a Chave Primária (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 4. Diz ao MySQL para auto-incrementar o ID
    private Long id;

    @Column(nullable = false) // Garante que o nome não pode ser nulo
    private String nome;

    @Column(nullable = false)
    private double preco;

    private String categoria; // Ex: "Bebidas", "Comidas", "Sobremesas"

    // (Tipo 2 = Bebida, Tipo 3 = Comida, Outro = Sem gorjeta)
    @Column(nullable = false)
    private int tipo;

    // --- Construtores ---

    public ItemCardapio() {
    }

    public ItemCardapio(String nome, double preco, String categoria, int tipo) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.tipo = tipo;
    }

    // --- Getters e Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public int getTipo() {
        return tipo;
    }

    public void setTipo(int tipo) {
        this.tipo = tipo;
    }
}