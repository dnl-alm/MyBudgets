package br.com.mybudgets.dto.response;

public record AuthResponse(
        String token,
        String name,
        String email
) {}