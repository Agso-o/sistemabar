package br.com.sistemabar.sistemabar.dto;

import br.com.sistemabar.sistemabar.model.PerfilUsuario;

public record CadastroRequestDTO(String login, String senha, PerfilUsuario perfil) {
}
