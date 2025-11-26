package br.com.sistemabar.sistemabar.dto;

// DTOs (Data Transfer Objects) para as ações do Garçom
public class GarcomRequestDTOs {

    // Usado para ABRIR MESA
    public static class AbrirMesaRequest {
        private int numeroMesa;
        private int pessoas;

        // getters e setters
        public int getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(int numeroMesa) { this.numeroMesa = numeroMesa; }
        public int getPessoas() { return pessoas; }
        public void setPessoas(int pessoas) { this.pessoas = pessoas; }
    }

    // Usado para ADICIONAR PEDIDO
    public static class AdicionarPedidoRequest {
        private Long comandaId;
        private Long itemId;
        private int quantidade;

        // getters e setters
        public Long getComandaId() { return comandaId; }
        public void setComandaId(Long comandaId) { this.comandaId = comandaId; }
        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }
        public int getQuantidade() { return quantidade; }
        public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
    }

    // Usado para CANCELAR PEDIDO
    public static class CancelarPedidoRequest {
        private Long pedidoId;
        private String motivo;

        // getters e setters
        public Long getPedidoId() { return pedidoId; }
        public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }
        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
    }

    // Usado para REGISTRAR PAGAMENTO
    public static class RegistrarPagamentoRequest {
        private Long comandaId;
        private double valor;

        // getters e setters
        public Long getComandaId() { return comandaId; }
        public void setComandaId(Long comandaId) { this.comandaId = comandaId; }
        public double getValor() { return valor; }
        public void setValor(double valor) { this.valor = valor; }
    }
}