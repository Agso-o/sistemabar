package br.com.sistemabar.sistemabar.config;

import br.com.sistemabar.sistemabar.model.PerfilUsuario;
import br.com.sistemabar.sistemabar.model.Usuario;
import br.com.sistemabar.sistemabar.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Verificar se já existe o Admin
            if (repository.findByLogin("admin").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setLogin("admin");
                admin.setSenha(passwordEncoder.encode("admin")); // Senha criptografada
                admin.setPerfil(PerfilUsuario.ADMIN);
                repository.save(admin);
                System.out.println(">>> Usuário 'admin' criado com senha 'admin'.");
            }

            // Verificar se já existe o Garçom
            if (repository.findByLogin("garcom").isEmpty()) {
                Usuario garcom = new Usuario();
                garcom.setLogin("garcom");
                garcom.setSenha(passwordEncoder.encode("garcom")); // Senha criptografada
                garcom.setPerfil(PerfilUsuario.GARCOM);
                repository.save(garcom);
                System.out.println(">>> Usuário 'garcom' criado com senha 'garcom'.");
            }
        };
    }
}