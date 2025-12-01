package br.com.sistemabar.sistemabar.service;

import br.com.sistemabar.sistemabar.model.Configuracao;
import br.com.sistemabar.sistemabar.model.ItemCardapio;
import br.com.sistemabar.sistemabar.model.Mesa;
import br.com.sistemabar.sistemabar.model.StatusMesa;
import br.com.sistemabar.sistemabar.repository.ConfiguracaoRepository;
import br.com.sistemabar.sistemabar.repository.ItemCardapioRepository;
import br.com.sistemabar.sistemabar.repository.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final MesaRepository mesaRepository;
    private final ItemCardapioRepository itemCardapioRepository;
    private final ConfiguracaoRepository configuracaoRepository;

    @Autowired
    public AdminService(MesaRepository mesaRepository,
                        ItemCardapioRepository itemCardapioRepository,
                        ConfiguracaoRepository configuracaoRepository) {
        this.mesaRepository = mesaRepository;
        this.itemCardapioRepository = itemCardapioRepository;
        this.configuracaoRepository = configuracaoRepository;
    }

    // --- Gerenciamento de Cardápio ---

    @Transactional
    public ItemCardapio salvarItemCardapio(ItemCardapio item) {
        if (item.getNome() == null || item.getNome().isBlank()) throw new RuntimeException("Nome obrigatório.");
        if (item.getPreco() < 0) throw new RuntimeException("Preço negativo.");

        // Verifica se o número já existe em OUTRO item (para evitar duplicação)
        Optional<ItemCardapio> itemExistente = itemCardapioRepository.findByNumero(item.getNumero());

        if (itemExistente.isPresent()) {
            if (item.getId() != null && !itemExistente.get().getId().equals(item.getId())) {
                throw new RuntimeException("Já existe um item com o número " + item.getNumero());
            }
            if (item.getId() == null) {
                throw new RuntimeException("Já existe um item com o número " + item.getNumero());
            }
        }

        if (item.getId() == null) {
            item.setAtivo(true);
        }

        return itemCardapioRepository.save(item);
    }

    @Transactional
    public void deletarItemCardapio(Long itemId) {
        ItemCardapio item = itemCardapioRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado."));

        // SOFT DELETE: Apenas inativa
        item.setAtivo(false);
        itemCardapioRepository.save(item);
    }

    // Buscar item pelo numero
    public ItemCardapio buscarItemPorNumero(int numero) {
        return itemCardapioRepository.findByNumero(numero).orElse(null);
    }

    public List<ItemCardapio> listarItensCardapio() {
        return itemCardapioRepository.findAll();
    }

    // --- Gerenciamento de Mesas ---
    @Transactional
    public Mesa salvarMesa(Mesa mesa) {
        if (mesa.getNumero() <= 0) throw new RuntimeException("Número inválido.");
        if (mesa.getStatus() == null) mesa.setStatus(StatusMesa.FECHADA);
        return mesaRepository.save(mesa);
    }

    @Transactional
    public void deletarMesa(Long mesaId) {
        Mesa mesa = mesaRepository.findById(mesaId)
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada."));
        if (mesa.getStatus() == StatusMesa.ABERTA) throw new RuntimeException("Não pode deletar mesa ABERTA.");
        mesaRepository.delete(mesa);
    }

    public List<Mesa> listarMesas() { return mesaRepository.findAll(); }

    // --- Configurações ---
    public Configuracao getConfiguracoes() {
        return configuracaoRepository.findById(1L).orElse(new Configuracao());
    }

    @Transactional
    public Configuracao salvarConfiguracoes(Configuracao config) {
        config.setId(1L);
        return configuracaoRepository.save(config);
    }
}