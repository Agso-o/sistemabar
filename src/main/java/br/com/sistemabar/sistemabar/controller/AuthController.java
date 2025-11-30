package br.com.sistemabar.sistemabar.controller;

import br.com.sistemabar.sistemabar.dto.AuthDTO.LoginRequestDTO;
import br.com.sistemabar.sistemabar.dto.AuthDTO.LoginResponseDTO;
import br.com.sistemabar.sistemabar.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO data) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.senha());
            var auth = this.authenticationManager.authenticate(usernamePassword);

            Usuario usuario = (Usuario) auth.getPrincipal();

            return ResponseEntity.ok(new LoginResponseDTO("token_simulado_" + data.login(), usuario.getPerfil().toString()));

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Falha na autenticação: Verifique usuário e senha.");
        }
    }

    // O método 'cadastrar' foi REMOVIDO daqui.
}