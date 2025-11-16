package br.com.sistemabar.sistemabar.repository;

import br.com.sistemabar.sistemabar.model.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {
    Mesa findByNumero(int numero);
}