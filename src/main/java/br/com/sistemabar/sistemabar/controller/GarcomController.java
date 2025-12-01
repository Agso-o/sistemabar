package br.com.sistemabar.sistemabar.controller;

import br.com.sistemabar.sistemabar.dto.GarcomRequestDTOs.*;
import br.com.sistemabar.sistemabar.service.MesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/garcom")
@CrossOrigin(origins = "*")
public class GarcomController {

    @Autowired
    private MesaService mesaService;

    @PostMapping("/abrir-mesa")
    public ResponseEntity<?> abrirMesa(@RequestBody AbrirMesaRequest request) {
        try {
            return ResponseEntity.ok(mesaService.abrirMesa(request.getNumeroMesa(), request.getPessoas()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/add-pessoa")
    public ResponseEntity<?> adicionarPessoa(@RequestBody AdicionarPessoaRequest request) {
        try {
            return ResponseEntity.ok(mesaService.adicionarPessoasMesa(request.getNumeroMesa(), request.getQuantidade()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/add-pedido")
    public ResponseEntity<?> adicionarPedido(@RequestBody AdicionarPedidoRequest request) {
        try {
            return ResponseEntity.ok(mesaService.adicionarPedido(request.getNumeroMesa(), request.getNumeroItem(), request.getQuantidade()));
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

    // NOVO ENDPOINT DE COUVERT
    @PostMapping("/couvert")
    public ResponseEntity<?> definirCouvert(@RequestBody DefinirCouvertRequest request) {
        try {
            return ResponseEntity.ok(mesaService.atualizarCouvertMesa(request.getNumeroMesa(), request.isCobrar()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/saldo")
    public ResponseEntity<?> consultarSaldo(@RequestParam int mesa) {
        try {
            return ResponseEntity.ok(mesaService.consultarSaldoMesa(mesa));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/pagar")
    public ResponseEntity<?> registrarPagamento(@RequestBody RegistrarPagamentoRequest request) {
        try {
            return ResponseEntity.ok(mesaService.registrarPagamento(request.getNumeroMesa(), request.getValor()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/fechar")
    public ResponseEntity<?> fecharConta(@RequestBody FecharContaRequest request) {
        try {
            return ResponseEntity.ok(mesaService.fecharComanda(request.getNumeroMesa()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}