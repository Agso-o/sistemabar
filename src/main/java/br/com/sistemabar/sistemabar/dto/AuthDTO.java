package br.com.sistemabar.sistemabar.dto;

import br.com.sistemabar.sistemabar.model.PerfilUsuario;

public class AuthDTO {

    public static record LoginRequestDTO(String login, String senha) {}

    public static record CadastroRequestDTO(String login, String senha, PerfilUsuario perfil) {}

    // ADICIONEI O CAMPO 'String perfil' AQUI
    public static record LoginResponseDTO(String token, String perfil) {}
}