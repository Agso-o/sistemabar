package br.com.sistemabar.sistemabar.repository;

import br.com.sistemabar.sistemabar.model.Comanda;
import br.com.sistemabar.sistemabar.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    // Método mágico do Spring:
    // "Encontre todos os Pagamentos pela Comanda"
    // Isso será essencial para somar quanto já foi pago na conta.
    List<Pagamento> findByComanda(Comanda comanda);
}