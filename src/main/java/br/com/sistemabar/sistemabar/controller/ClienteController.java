package br.com.sistemabar.sistemabar.controller;

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

    // Conectado ao 'carregarConsumo' do cliente.js
    @GetMapping("/extrato/{comandaId}")
    public ResponseEntity<?> getExtrato(@PathVariable Long comandaId) {
        try {
            return ResponseEntity.ok(consultaService.gerarExtrato(comandaId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}