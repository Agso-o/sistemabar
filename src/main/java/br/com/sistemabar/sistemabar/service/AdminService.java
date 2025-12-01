package br.com.sistemabar.sistemabar.service;

import br.com.sistemabar.sistemabar.model.Configuracao;
import br.com.sistemabar.sistemabar.model.ItemCardapio;
import br.com.sistemabar.sistemabar.model.Mesa;
import br.com.sistemabar.sistemabar.model.StatusMesa;
import br.com.sistemabar.sistemabar.repository.ConfiguracaoRepository;
import br.com.sistemabar.sistemabar.repository.ItemCardapioRepository;
import br.com.sistemabar.sistemabar.repository.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    // MÉTODO QUE FALTAVA:
    public ItemCardapio buscarItemPorNumero(int numero) {
        // Como sua tabela não tem coluna 'numero', usamos o ID como código
        return itemCardapioRepository.findById((long) numero).orElse(null);
    }

    @Transactional
    public ItemCardapio salvarItemCardapio(ItemCardapio item) {
        if (item.getNome() == null || item.getNome().isBlank()) {
            throw new RuntimeException("Nome obrigatório.");
        }
        if (item.getPreco() < 0) {
            throw new RuntimeException("Preço negativo.");
        }
        // Removemos a verificação de 'numero' duplicado pois usamos o ID automático
        return itemCardapioRepository.save(item);
    }

    @Transactional
    public void deletarItemCardapio(Long itemId) {
        if (!itemCardapioRepository.existsById(itemId)) {
            throw new RuntimeException("Item não encontrado para deletar.");
        }
        // CORREÇÃO: Usamos deleteById (exclusão real) porque sua tabela não tem campo 'ativo'
        itemCardapioRepository.deleteById(itemId);
    }

    public List<ItemCardapio> listarItensCardapio() {
        return itemCardapioRepository.findAll();
    }

    // --- Gerenciamento de Mesas ---

    @Transactional
    public Mesa salvarMesa(Mesa mesa) {
        if (mesa.getNumero() <= 0) {
            throw new RuntimeException("O número da mesa é inválido.");
        }

        if (mesa.getId() != null) {
            // EDIÇÃO
            Mesa mesaExistente = mesaRepository.findById(mesa.getId())
                    .orElseThrow(() -> new RuntimeException("Mesa não encontrada."));

            mesaExistente.setNumero(mesa.getNumero());

            if (mesa.getStatus() != null) {
                mesaExistente.setStatus(mesa.getStatus());
            }
            return mesaRepository.save(mesaExistente);

        } else {
            // CRIAÇÃO
            if (mesaRepository.findByNumero(mesa.getNumero()) != null) {
                throw new RuntimeException("Mesa já existe: " + mesa.getNumero());
            }

            if (mesa.getStatus() == null) {
                // Usa o padrão do seu Enum (FECHADA = Livre)
                mesa.setStatus(StatusMesa.FECHADA);
            }
            return mesaRepository.save(mesa);
        }
    }

    @Transactional
    public void deletarMesa(Long mesaId) {
        Mesa mesa = mesaRepository.findById(mesaId)
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada."));

        // Regra 1: Não pode deletar se estiver EM USO agora
        if (mesa.getStatus() == StatusMesa.ABERTA) {
            throw new RuntimeException("Não pode deletar mesa que está EM USO (Aberta).");
        }

        // Regra 2: Tenta deletar, mas captura erro se tiver histórico
        try {
            mesaRepository.delete(mesa);
            // Força o envio para o banco agora para testar o erro dentro do try
            mesaRepository.flush();
        } catch (DataIntegrityViolationException e) {
            // Se cair aqui, é porque tem Comandas ligadas a essa mesa
            throw new RuntimeException("Não é possível excluir esta mesa pois ela possui histórico de Comandas/Vendas.");
        }
    }

    public List<Mesa> listarMesas() {
        return mesaRepository.findAll();
    }

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