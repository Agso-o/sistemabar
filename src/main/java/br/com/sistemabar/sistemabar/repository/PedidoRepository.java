package br.com.sistemabar.sistemabar.repository;

import br.com.sistemabar.sistemabar.model.Comanda;
import br.com.sistemabar.sistemabar.model.Pedido;
import br.com.sistemabar.sistemabar.model.StatusPedido; // <-- Usa o novo Enum
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Encontra todos os pedidos ATIVOS de uma comanda
    List<Pedido> findByComandaAndStatus(Comanda comanda, StatusPedido status);

    // Encontra TODOS os pedidos de uma comanda (ativos e cancelados)
    List<Pedido> findByComanda(Comanda comanda);
}
