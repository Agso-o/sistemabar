package br.com.sistemabar.sistemabar.controller;

import br.com.sistemabar.sistemabar.model.StatusComanda;
import br.com.sistemabar.sistemabar.repository.ComandaRepository;
import br.com.sistemabar.sistemabar.repository.MesaRepository;
import br.com.sistemabar.sistemabar.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cliente")
@CrossOrigin(origins = "*") // Público, sem segurança
public class ClienteController {

    @Autowired
    private ConsultaService consultaService;

    // --- NOVAS INJEÇÕES NECESSÁRIAS PARA O QR CODE ---
    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private ComandaRepository comandaRepository;

    // Método antigo (busca direta pelo ID da comanda)
    @GetMapping("/extrato/{comandaId}")
    public ResponseEntity<?> getExtrato(@PathVariable Long comandaId) {
        try {
            return ResponseEntity.ok(consultaService.gerarExtrato(comandaId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- NOVO MÉTODO (ESSENCIAL PARA O QR CODE) ---
    // O QR Code envia o ID da Mesa. Este método descobre qual é a comanda ABERTA naquela mesa.
    @GetMapping("/mesa/{mesaId}/atual")
    public ResponseEntity<?> getComandaAtual(@PathVariable Long mesaId) {
        try {
            // 1. Acha a mesa
            var mesa = mesaRepository.findById(mesaId)
                    .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));

            // 2. Acha a comanda que está ABERTA nesta mesa
            var comanda = comandaRepository.findByMesaAndStatus(mesa, StatusComanda.ABERTA)
                    .orElseThrow(() -> new RuntimeException("Não há conta aberta para esta mesa no momento."));

            // 3. Gera o extrato usando o ID da comanda encontrada
            return ResponseEntity.ok(consultaService.gerarExtrato(comanda.getId()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}