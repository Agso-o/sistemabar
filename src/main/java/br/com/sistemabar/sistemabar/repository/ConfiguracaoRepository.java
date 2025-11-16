package br.com.sistemabar.sistemabar.repository;

import br.com.sistemabar.sistemabar.model.Configuracao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfiguracaoRepository extends JpaRepository<Configuracao, Long> {
}