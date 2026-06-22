package br.com.mybudgets.exception;

public class InvalidCredentialsException extends BusinessException {

    public InvalidCredentialsException() {
        super("Email ou senha inválidos");
    }
}