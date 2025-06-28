package com.cts.apigatway.util;

import java.security.Key;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class); // Logger instance

    public static final String SECRET = "d3780ec3d1cfaba271e0538d4fae686d8367e10155ee424691fbf191eabec53d";

    public void validateToken(final String token) {
        try {
            logger.info("Validating token...");
            Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token);
            logger.info("Token is valid!");
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage());
            throw e;
        }
    }

    public String extractRolesFromToken(final String token) {
        try {
            logger.info("Extracting roles from token...");
            Claims claims = Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody();

            logger.debug("Token claims extracted: {}", claims);
            String authorities = (String) claims.get("roles"); 
            
            logger.info("User roles found: {}", authorities);
            return authorities;
        } catch (Exception e) {
            logger.error("Failed to extract roles from token: {}", e.getMessage());
            return null;
        }
    }

    private Key getSignKey() {
        logger.info("Decoding secret key...");
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
