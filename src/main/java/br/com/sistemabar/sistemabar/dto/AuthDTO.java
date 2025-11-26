package br.com.sistemabar.sistemabar.dto;

import br.com.sistemabar.sistemabar.model.PerfilUsuario;

// Esta classe agora é a "container"
public class AuthDTO {

    // DTO para o request de /login
    public static record LoginRequestDTO(String login, String senha) {}

    // DTO para o request de /cadastrar
    public static record CadastroRequestDTO(String login, String senha, PerfilUsuario perfil) {}

    // DTO para a resposta de /login (enviando o token)
    public static record LoginResponseDTO(String token) {}

}