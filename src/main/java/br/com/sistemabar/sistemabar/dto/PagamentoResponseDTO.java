package br.com.sistemabar.sistemabar.dto;

import java.util.List;

public record PagamentoResponseDTO(
        double valorPagoAgora,   // O valor que acabou de ser processado (se houver)
        double subtotalItens,    // Soma dos produtos
        double valorGorjeta,     // Valor calculado da gorjeta
        double valorCouvert,     // Valor calculado do couvert
        double totalConta,       // A soma de tudo (Bruto)
        double totalJaPago,      // Quanto já foi abatido
        double saldoRestante,    // Quanto falta
        List<Double> pagamentosParciais // Histórico
) {}