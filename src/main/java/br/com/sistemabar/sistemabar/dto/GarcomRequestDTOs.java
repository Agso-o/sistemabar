package br.com.sistemabar.sistemabar.dto;

public class GarcomRequestDTOs {

    public static class AbrirMesaRequest {
        private int numeroMesa;
        private int pessoas;
        // getters/setters
        public int getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(int numeroMesa) { this.numeroMesa = numeroMesa; }
        public int getPessoas() { return pessoas; }
        public void setPessoas(int pessoas) { this.pessoas = pessoas; }
    }

    public static class AdicionarPessoaRequest {
        private int numeroMesa;
        private int quantidade;
        // getters/setters
        public int getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(int numeroMesa) { this.numeroMesa = numeroMesa; }
        public int getQuantidade() { return quantidade; }
        public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
    }

    public static class AdicionarPedidoRequest {
        private int numeroMesa;
        private int numeroItem;
        private int quantidade;
        // getters/setters
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
        // getters/setters
        public Long getPedidoId() { return pedidoId; }
        public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }
        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
    }

    // NOVO DTO PARA COUVERT
    public static class DefinirCouvertRequest {
        private int numeroMesa;
        private boolean cobrar; // true = cobrar, false = isentar

        public int getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(int numeroMesa) { this.numeroMesa = numeroMesa; }
        public boolean isCobrar() { return cobrar; }
        public void setCobrar(boolean cobrar) { this.cobrar = cobrar; }
    }

    public static class RegistrarPagamentoRequest {
        private int numeroMesa;
        private double valor;
        // getters/setters
        public int getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(int numeroMesa) { this.numeroMesa = numeroMesa; }
        public double getValor() { return valor; }
        public void setValor(double valor) { this.valor = valor; }
    }

    public static class FecharContaRequest {
        private int numeroMesa;
        public int getNumeroMesa() { return numeroMesa; }
        public void setNumeroMesa(int numeroMesa) { this.numeroMesa = numeroMesa; }
    }
}