package br.com.sistemabar.sistemabar.repository;

import br.com.sistemabar.sistemabar.model.Comanda;
import br.com.sistemabar.sistemabar.model.Mesa;
import br.com.sistemabar.sistemabar.model.StatusComanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComandaRepository extends JpaRepository<Comanda, Long> {
    Optional<Comanda> findByMesaAndStatus(Mesa mesa, StatusComanda status);
}
