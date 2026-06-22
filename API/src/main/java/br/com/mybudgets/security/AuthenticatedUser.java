package br.com.mybudgets.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;

public class AuthenticatedUser extends UsernamePasswordAuthenticationToken {

    private final Long userId;

    public AuthenticatedUser(
            Object principal,
            Object credentials,
            Collection<? extends GrantedAuthority> authorities,
            Long userId
    ) {
        super(principal, credentials, authorities);
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }
}