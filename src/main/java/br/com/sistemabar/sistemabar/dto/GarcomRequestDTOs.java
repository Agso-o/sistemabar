package br.com.sistemabar.sistemabar.dto;

public class GarcomRequestDTOs {

    public static class AbrirMesaRequest {
        private int numeroMesa;
        private int pessoas;

        public int getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(int numeroMesa) { this.numeroMesa = numeroMesa; }
        public int getPessoas() { return pessoas; }
        public void setPessoas(int pessoas) { this.pessoas = pessoas; }
    }

    public static class AdicionarPedidoRequest {
        private int numeroMesa;
        private int numeroItem;
        private int quantidade;

        public int getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(int numeroMesa) { this.numeroMesa = numeroMesa; }
        public int getNumeroItem() { return numeroItem; }
        public void setNumeroItem(int numeroItem) { this.numeroItem = numeroItem; }
        public int getQuantidade() { return quantidade; }
        public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
    }

    public static class CancelarPedidoRequest {
        private Long pedidoId;
        private String motivo;

        public Long getPedidoId() { return pedidoId; }
        public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }
        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
    }

    public static class RegistrarPagamentoRequest {
        private int numeroMesa; // Usamos número da mesa agora
        private double valor;

        public int getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(int numeroMesa) { this.numeroMesa = numeroMesa; }
        public double getValor() { return valor; }
        public void setValor(double valor) { this.valor = valor; }
    }

    // Esta classe estava faltando e causava erro no GarcomController
    public static class FecharContaRequest {
        private int numeroMesa;

        public int getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(int numeroMesa) { this.numeroMesa = numeroMesa; }
    }
}