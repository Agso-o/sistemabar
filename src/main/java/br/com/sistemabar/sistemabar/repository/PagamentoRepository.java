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

    List<Pagamento> findByComanda(Comanda comanda);

    // --- ADICIONADO (NECESSÁRIO PARA RelatorioService) ---
    @Query("SELECT SUM(p.valor) FROM Pagamento p " +
            "WHERE p.dataPagamento BETWEEN :inicio AND :fim")
    Double sumValorByDataPagamentoBetween(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
}