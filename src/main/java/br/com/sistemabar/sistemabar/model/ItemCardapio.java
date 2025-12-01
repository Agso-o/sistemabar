package br.com.sistemabar.sistemabar.model;

import jakarta.persistence.*;

@Entity
@Table(name = "item_cardapio")
public class ItemCardapio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Uso interno do banco (Relacionamentos)

    @Column(nullable = false, unique = true)
    private int numero; // Uso do Usuário (Código do produto no cardápio)

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private double preco;

    private String categoria;

    @Column(nullable = false)
    private int tipo; // 2=Bebida, 3=Comida

    @Column(nullable = false)
    private boolean ativo; // true = Disponível, false = "Excluído" (Histórico mantido)

    // --- Construtores ---
    public ItemCardapio() {
    }

    public ItemCardapio(int numero, String nome, double preco, String categoria, int tipo) {
        this.numero = numero;
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.tipo = tipo;
        this.ativo = true; // Nasce ativo por padrão
    }

    // --- Getters e Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getNumero() { return numero; }
    public void setNumero(int numero) { this.numero = numero; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public double getPreco() { return preco; }
    public void setPreco(double preco) { this.preco = preco; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public int getTipo() { return tipo; }
    public void setTipo(int tipo) { this.tipo = tipo; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
}