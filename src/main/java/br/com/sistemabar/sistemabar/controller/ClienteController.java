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

    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private ComandaRepository comandaRepository;

    // Método antigo (busca direta pelo ID da comanda - usado se você acessar /extrato/ID manualmente)
    @GetMapping("/extrato/{comandaId}")
    public ResponseEntity<?> getExtrato(@PathVariable Long comandaId) {
        try {
            return ResponseEntity.ok(consultaService.gerarExtrato(comandaId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- CORREÇÃO AQUI ---
    // Alterado de 'findById' para 'findByNumero'
    // A URL também mudou para deixar claro que é o número: /mesa/numero/{numero}/atual
    @GetMapping("/mesa/numero/{numeroMesa}/atual")
    public ResponseEntity<?> getComandaAtualPorNumero(@PathVariable int numeroMesa) {
        try {
            // 1. Acha a mesa pelo NÚMERO VISUAL (Ex: Mesa 1)
            var mesa = mesaRepository.findByNumero(numeroMesa);

            if (mesa == null) {
                throw new RuntimeException("Mesa número " + numeroMesa + " não existe.");
            }

            // 2. Acha a comanda que está ABERTA nesta mesa
            var comanda = comandaRepository.findByMesaAndStatus(mesa, StatusComanda.ABERTA)
                    .orElseThrow(() -> new RuntimeException("A Mesa " + numeroMesa + " está fechada ou livre."));

            // 3. Gera o extrato
            return ResponseEntity.ok(consultaService.gerarExtrato(comanda.getId()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}