package br.com.sistemabar.sistemabar.dto;

import java.util.List;

// DTO para o extrato do cliente
// (Exatamente o que o cliente.js espera)
public record ExtratoDTO(
        Long comandaId,
        int numeroMesa,
        String status,
        List<ItemConsumidoDTO> itensConsumidos,
        double subtotalComida,
        double subtotalBebida,
        double couvert,
        double gorjeta,
        double totalPago,
        double saldoDevedor
) {}