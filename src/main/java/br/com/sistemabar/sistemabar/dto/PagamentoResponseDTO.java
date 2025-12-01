package br.com.sistemabar.sistemabar.dto;

import java.util.List;

public record PagamentoResponseDTO(
        double valorPago,        // Valor pago agora
        double totalConta,       // Total bruto
        double totalJaPago,      // Soma de tudo pago
        double saldoRestante,    // Quanto falta
        List<Double> pagamentosParciais // Lista com todos os pagamentos dessa comanda
) {}