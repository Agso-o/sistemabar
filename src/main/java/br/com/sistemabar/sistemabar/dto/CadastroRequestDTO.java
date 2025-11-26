package br.com.sistemabar.sistemabar.dto;

import br.com.sistemabar.sistemabar.model.PerfilUsuario;

// DTO para o request de /cadastrar
public record CadastroRequestDTO(String login, String senha, PerfilUsuario perfil) {
}
