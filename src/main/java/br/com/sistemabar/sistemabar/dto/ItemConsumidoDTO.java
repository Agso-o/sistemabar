package br.com.sistemabar.sistemabar.dto;

// DTO para os itens da lista do extrato
public record ItemConsumidoDTO(
        Long pedidoId,
        String nome,
        int qtd,
        double valorTotal
) {}