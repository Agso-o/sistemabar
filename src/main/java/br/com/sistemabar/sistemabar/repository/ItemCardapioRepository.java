package br.com.sistemabar.sistemabar.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.sistemabar.sistemabar.model.ItemCardapio;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCardapioRepository extends JpaRepository<ItemCardapio, Long> {

}
