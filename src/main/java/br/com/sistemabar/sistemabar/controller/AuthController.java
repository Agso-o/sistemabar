package br.com.sistemabar.sistemabar.controller;

// --- Imports Corrigidos ---
// (Dizendo ao Java para procurar os DTOs DENTRO da classe AuthDTO)
import br.com.sistemabar.sistemabar.dto.AuthDTO.CadastroRequestDTO;
import br.com.sistemabar.sistemabar.dto.AuthDTO.LoginRequestDTO;
import br.com.sistemabar.sistemabar.dto.AuthDTO.LoginResponseDTO;
// --- Fim da Correção ---

import br.com.sistemabar.sistemabar.model.Usuario;
import br.com.sistemabar.sistemabar.repository.UsuarioRepository;
// Importe seu TokenService da playlist (ex: service.TokenService)
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*") // Permite acesso do front-end
@RequestMapping // Mapeia para a raiz (onde /login e /cadastrar estão)
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // @Autowired
    // private TokenService tokenService; // <-- DESCOMENTE ISSO quando tiver o TokenService

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO data) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.senha());
            var auth = this.authenticationManager.authenticate(usernamePassword);

            // --- GERAÇÃO DE TOKEN REAL (da playlist) ---
            // (Descomente isso quando seu TokenService estiver pronto)
            // var token = tokenService.gerarToken((Usuario) auth.getPrincipal());
            // return ResponseEntity.ok(new LoginResponseDTO(token));

            // --- SIMULAÇÃO (para testar sem o TokenService) ---
            System.out.println("Login com sucesso, simulando token.");
            return ResponseEntity.ok(new LoginResponseDTO("token_simulado_" + data.login()));

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Falha na autenticação: " + e.getMessage());
        }
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody CadastroRequestDTO data) {
        if (this.usuarioRepository.findByLogin(data.login()).isPresent()) {
            return ResponseEntity.badRequest().body("Login já existente.");
        }

        String senhaCriptografada = passwordEncoder.encode(data.senha());
        Usuario novoUsuario = new Usuario(data.login(), senhaCriptografada, data.perfil());

        this.usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok().body("Usuário cadastrado com sucesso.");
    }
}