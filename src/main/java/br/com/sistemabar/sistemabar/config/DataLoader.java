package br.com.sistemabar.sistemabar.config;

import br.com.sistemabar.sistemabar.model.Configuracao;
import br.com.sistemabar.sistemabar.model.PerfilUsuario;
import br.com.sistemabar.sistemabar.model.Usuario;
import br.com.sistemabar.sistemabar.repository.ConfiguracaoRepository;
import br.com.sistemabar.sistemabar.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository,
                                   ConfiguracaoRepository configuracaoRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Criar Usuários Padrão
            if (usuarioRepository.findByLogin("admin").isEmpty()) {
                Usuario admin = new Usuario("admin", passwordEncoder.encode("admin"), PerfilUsuario.ADMIN);
                usuarioRepository.save(admin);
                System.out.println(">>> Usuário 'admin' criado.");
            }

            if (usuarioRepository.findByLogin("garcom").isEmpty()) {
                Usuario garcom = new Usuario("garcom", passwordEncoder.encode("garcom"), PerfilUsuario.GARCOM);
                usuarioRepository.save(garcom);
                System.out.println(">>> Usuário 'garcom' criado.");
            }

            // 2. Criar Configuração Padrão (ID 1)
            if (configuracaoRepository.findById(1L).isEmpty()) {
                Configuracao config = new Configuracao();
                config.setId(1L);
                config.setValorCouvertPessoa(0.0); // Padrão sem couvert
                config.setPercentualGorjetaBebida(0.0); // Padrão sem gorjeta
                config.setPercentualGorjetaComida(0.0);
                configuracaoRepository.save(config);
                System.out.println(">>> Configurações iniciais criadas (ID 1).");
            }
        };
    }
}