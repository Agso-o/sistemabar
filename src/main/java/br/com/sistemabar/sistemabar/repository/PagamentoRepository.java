package br.com.sistemabar.sistemabar.repository;

import br.com.sistemabar.sistemabar.model.Comanda;
import br.com.sistemabar.sistemabar.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    // ALTERAÇÃO: Adicionado 'OrderByIdAsc' para garantir a ordem cronológica
    List<Pagamento> findByComandaOrderByIdAsc(Comanda comanda);

    // Mantido para compatibilidade, caso algum método antigo use
    List<Pagamento> findByComanda(Comanda comanda);

    @Query("SELECT SUM(p.valor) FROM Pagamento p WHERE p.dataPagamento BETWEEN :inicio AND :fim")
    Double sumValorByDataPagamentoBetween(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
}