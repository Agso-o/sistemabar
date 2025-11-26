package br.com.sistemabar.sistemabar.dto;

// DTO para o request de /login
// (record é uma forma moderna de DTO que o Spring adora)
public record LoginRequestDTO(String login, String senha) {
}
