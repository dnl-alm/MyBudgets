package br.com.mybudgets.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public Long getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth instanceof AuthenticatedUser authenticatedUser) {
            return authenticatedUser.getUserId();
        }

        throw new IllegalStateException("Usuário não autenticado corretamente");
    }
}