package br.com.sistemabar.sistemabar.repository;

import br.com.sistemabar.sistemabar.dto.ItemMaiorFaturamentoDTO;
import br.com.sistemabar.sistemabar.dto.ItemMaisVendidoDTO;
import br.com.sistemabar.sistemabar.model.Comanda;
import br.com.sistemabar.sistemabar.model.Pedido;
import br.com.sistemabar.sistemabar.model.StatusPedido; // <-- Usa o novo Enum
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Encontra todos os pedidos ATIVOS de uma comanda
    List<Pedido> findByComandaAndStatus(Comanda comanda, StatusPedido status);

    // Encontra TODOS os pedidos de uma comanda (ativos e cancelados)
    List<Pedido> findByComanda(Comanda comanda);

    @Query("SELECT new br.com.sistemabar.sistemabar.dto.ItemMaisVendidoDTO(i.nome, SUM(p.quantidade)) " +
            "FROM Pedido p JOIN p.item i " +
            "WHERE p.status = 'ATIVO' " +
            "GROUP BY i.nome " +
            "ORDER BY SUM(p.quantidade) DESC")
    List<ItemMaisVendidoDTO> findItensMaisVendidos();

    /**
     * Relatório de Itens com Maior Faturamento.
     */
    @Query("SELECT new br.com.sistemabar.sistemabar.dto.ItemMaiorFaturamentoDTO(i.nome, SUM(p.quantidade * p.precoUnitarioSnapshot)) " +
            "FROM Pedido p JOIN p.item i " +
            "WHERE p.status = 'ATIVO' " +
            "GROUP BY i.nome " +
            "ORDER BY SUM(p.quantidade * p.precoUnitarioSnapshot) DESC")
    List<ItemMaiorFaturamentoDTO> findItensMaiorFaturamento();
}
