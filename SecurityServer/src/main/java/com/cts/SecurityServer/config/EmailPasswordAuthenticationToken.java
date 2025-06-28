package com.cts.SecurityServer.config;

import org.springframework.security.authentication.AbstractAuthenticationToken;

public class EmailPasswordAuthenticationToken extends AbstractAuthenticationToken {
    private final String email;
    private final String password;

    public EmailPasswordAuthenticationToken(String email, String password) {
        super(null); // No authorities during authentication
        this.email = email;
        this.password = password;
        setAuthenticated(false);
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public Object getPrincipal() {
        return email;
    }

    @Override
    public Object getCredentials() {
        return password;
    }
}
