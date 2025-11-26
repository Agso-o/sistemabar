package br.com.sistemabar.sistemabar.controller;

import br.com.sistemabar.sistemabar.dto.GarcomRequestDTOs.*;
import br.com.sistemabar.sistemabar.service.MesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/garcom")
@CrossOrigin(origins = "*")
// @PreAuthorize("hasRole('GARCOM')") // Ative isso quando o Spring Security estiver 100%
public class GarcomController {

    @Autowired
    private MesaService mesaService;

    @PostMapping("/abrir-mesa")
    public ResponseEntity<?> abrirMesa(@RequestBody AbrirMesaRequest request) {
        try {
            return ResponseEntity.ok(mesaService.abrirMesa(request.getNumeroMesa(), request.getPessoas()));
        } catch (Exception e) {
            // Retorna a mensagem de erro do Service (ex: "Mesa já está ocupada")
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/add-pedido")
    public ResponseEntity<?> adicionarPedido(@RequestBody AdicionarPedidoRequest request) {
        try {
            return ResponseEntity.ok(mesaService.adicionarPedido(request.getComandaId(), request.getItemId(), request.getQuantidade()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancelar-pedido")
    public ResponseEntity<?> cancelarPedido(@RequestBody CancelarPedidoRequest request) {
        try {
            return ResponseEntity.ok(mesaService.cancelarPedido(request.getPedidoId(), request.getMotivo()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/pagar")
    public ResponseEntity<?> registrarPagamento(@RequestBody RegistrarPagamentoRequest request) {
        try {
            return ResponseEntity.ok(mesaService.registrarPagamento(request.getComandaId(), request.getValor()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}