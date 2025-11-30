package br.com.sistemabar.sistemabar.controller;

import br.com.sistemabar.sistemabar.dto.AuthDTO.CadastroRequestDTO;
import br.com.sistemabar.sistemabar.dto.AuthDTO.LoginRequestDTO;
import br.com.sistemabar.sistemabar.dto.AuthDTO.LoginResponseDTO;
import br.com.sistemabar.sistemabar.model.Usuario;
import br.com.sistemabar.sistemabar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO data) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.senha());
            var auth = this.authenticationManager.authenticate(usernamePassword);

            // PEGA O USUÁRIO REAL DO BANCO
            Usuario usuario = (Usuario) auth.getPrincipal();

            // AGORA ENVIAMOS O PERFIL CORRETO (usuario.getPerfil())
            return ResponseEntity.ok(new LoginResponseDTO("token_simulado_" + data.login(), usuario.getPerfil().toString()));

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