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

@Service
public class AdminService {

    // --- Injeção de Dependência ---
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
        // Validações básicas
        if (item.getNome() == null || item.getNome().isBlank()) {
            throw new RuntimeException("O nome do item é obrigatório.");
        }
        if (item.getPreco() < 0) {
            throw new RuntimeException("O preço não pode ser negativo.");
        }
        return itemCardapioRepository.save(item);
    }


    @Transactional
    public void deletarItemCardapio(Long itemId) {
        if (!itemCardapioRepository.existsById(itemId)) {
            throw new RuntimeException("Item não encontrado para deletar.");
        }
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
        // Garante que o status seja 'LIVRE' ao criar/salvar,
        // a menos que já esteja 'OCUPADA'
        if (mesa.getStatus() == null) {
            mesa.setStatus(StatusMesa.LIVRE);
        }
        return mesaRepository.save(mesa);
    }


    @Transactional
    public void deletarMesa(Long mesaId) {
        Mesa mesa = mesaRepository.findById(mesaId)
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada."));

        if (mesa.getStatus() == StatusMesa.OCUPADA) {
            throw new RuntimeException("Não é possível deletar uma mesa ocupada.");
        }
        mesaRepository.delete(mesa);
    }

    public List<Mesa> listarMesas() {
        return mesaRepository.findAll();
    }

    public Configuracao getConfiguracoes() {
        // .findById(1L) busca a linha de ID 1. Se não achar, cria uma padrão.
        return configuracaoRepository.findById(1L)
                .orElse(new Configuracao()); // Retorna um objeto vazio se não existir
    }


    @Transactional
    public Configuracao salvarConfiguracoes(Configuracao config) {
        // Garante que estamos sempre salvando na ID=1
        config.setId(1L);

        if (config.getPercentualGorjetaBebida() < 0 ||
                config.getPercentualGorjetaComida() < 0 ||
                config.getValorCouvertPessoa() < 0) {
            throw new RuntimeException("Valores de configuração não podem ser negativos.");
        }

        return configuracaoRepository.save(config);
    }
}