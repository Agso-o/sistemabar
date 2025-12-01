package br.com.sistemabar.sistemabar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.sistemabar.sistemabar.model.ItemCardapio;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemCardapioRepository extends JpaRepository<ItemCardapio, Long> {

    // Busca pelo código visual do usuário
    Optional<ItemCardapio> findByNumero(int numero);

    boolean existsByNumero(int numero);
}