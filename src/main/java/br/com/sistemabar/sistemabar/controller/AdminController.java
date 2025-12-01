package br.com.sistemabar.sistemabar.controller;

import br.com.sistemabar.sistemabar.dto.*;
import br.com.sistemabar.sistemabar.model.*;
import br.com.sistemabar.sistemabar.repository.*;
import br.com.sistemabar.sistemabar.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired private AdminService adminService;
    @Autowired private RelatorioService relatorioService;
    @Autowired private MesaRepository mesaRepository;

    // --- CARDÁPIO ---

    @GetMapping("/cardapio")
    public ResponseEntity<List<ItemCardapio>> listarItens() {
        return ResponseEntity.ok(adminService.listarItensCardapio());
    }

    // Busca item pelo NÚMERO visual (para verificar antes de criar/editar)
    @GetMapping("/cardapio/buscar")
    public ResponseEntity<?> buscarItemPorNumero(@RequestParam int numero) {
        ItemCardapio item = adminService.buscarItemPorNumero(numero);
        if (item != null) {
            return ResponseEntity.ok(item);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/cardapio")
    public ResponseEntity<?> salvarItem(@RequestBody ItemCardapio item) {
        try {
            return ResponseEntity.ok(adminService.salvarItemCardapio(item));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/cardapio/{id}")
    public ResponseEntity<?> deletarItem(@PathVariable Long id) {
        try {
            // O AdminService foi configurado para fazer "Soft Delete" (Inativar)
            adminService.deletarItemCardapio(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- MESAS ---

    @GetMapping("/mesas")
    public ResponseEntity<List<Mesa>> listarMesas() {
        return ResponseEntity.ok(adminService.listarMesas());
    }

    @GetMapping("/mesas/buscar")
    public ResponseEntity<?> buscarMesaPorNumero(@RequestParam int numero) {
        Mesa mesa = mesaRepository.findByNumero(numero);
        if (mesa != null) {
            return ResponseEntity.ok(mesa);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/mesas")
    public ResponseEntity<?> salvarMesa(@RequestBody Mesa mesa) {
        try {
            return ResponseEntity.ok(adminService.salvarMesa(mesa));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/mesas/{id}")
    public ResponseEntity<?> deletarMesa(@PathVariable Long id) {
        try {
            adminService.deletarMesa(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- CONFIGURAÇÕES ---

    @GetMapping("/configuracoes")
    public ResponseEntity<Configuracao> getConfiguracoes() {
        return ResponseEntity.ok(adminService.getConfiguracoes());
    }

    @PostMapping("/configuracoes")
    public ResponseEntity<?> salvarConfiguracoes(@RequestBody Configuracao config) {
        try {
            return ResponseEntity.ok(adminService.salvarConfiguracoes(config));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- RELATÓRIOS ---

    @GetMapping("/relatorio/faturamento")
    public ResponseEntity<Double> getFaturamento(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return ResponseEntity.ok(relatorioService.getFaturamentoPorPeriodo(inicio, fim));
    }

    @GetMapping("/relatorio/mais-vendidos")
    public ResponseEntity<List<ItemMaisVendidoDTO>> getMaisVendidos() {
        return ResponseEntity.ok(relatorioService.getItensMaisVendidos());
    }

    @GetMapping("/relatorio/maior-faturamento")
    public ResponseEntity<List<ItemMaiorFaturamentoDTO>> getMaiorFaturamento() {
        return ResponseEntity.ok(relatorioService.getItensMaiorFaturamento());
    }
}