package com.cts.apigatway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

import com.google.common.net.HttpHeaders;
import reactor.core.publisher.Mono;
import com.cts.apigatway.util.JwtUtil;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationFilter.class); // Logger instance

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil util;

    public static class Config {
    }

    public AuthenticationFilter() {
        super(Config.class);
    }

//    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            logger.info("Processing request for path: {}", exchange.getRequest().getPath());

            if (validator.isSecured.test(exchange.getRequest())) {
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    logger.warn("Authorization header missing for path: {}", exchange.getRequest().getPath());
                    return handleUnauthorized(exchange.getResponse(), "Missing authorization header");
                }

                String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7);
                }

                try {
                    String role = util.extractRolesFromToken(authHeader);
                    String requestedPath = exchange.getRequest().getPath().toString();
                    String method = exchange.getRequest().getMethod().name();

                    logger.info("Authorization attempt: Role={} | Path={} | Method={}", role, requestedPath, method);

                    if (!isAuthorized(role, requestedPath, method)) {
                        logger.warn("Unauthorized access attempt: Role={} | Path={} | Method={}", role, requestedPath, method);
                        return handleUnauthorized(exchange.getResponse(), "Unauthorized access");
                    }

                } catch (Exception e) {
                    logger.error("Token validation failed: {}", e.getMessage());
                    return handleUnauthorized(exchange.getResponse(), "Invalid token");
                }
            }

            logger.info("Request authorized, proceeding...");
            return chain.filter(exchange);
        };
    }
    
    private boolean isAuthorized(String role, String path, String method) {
        if ("ADMIN".equalsIgnoreCase(role)) {
            return path.startsWith("/customers") || 
                   path.startsWith("/delivery") || 
                   path.startsWith("/order") || 
                   path.startsWith("/payment") || 
                   path.startsWith("/menu") || 
                   path.startsWith("/restaurant");
        } else if ("role_user".equalsIgnoreCase(role)) {
            return (path.startsWith("/customers") || 
                    path.startsWith("/delivery") ||
                    path.startsWith("/payment")) || 
                    path.startsWith("/order") || 
                    (path.startsWith("/restaurant") && method.equalsIgnoreCase("GET")) ||
                    (path.startsWith("/menu") && method.equalsIgnoreCase("GET"));
        } else if ("role_driver".equalsIgnoreCase(role)) {
            return (path.startsWith("/delivery") || path.startsWith("/order")) && method.equalsIgnoreCase("GET");
        } else if ("role_restaurant".equalsIgnoreCase(role)){
            return  path.startsWith("/delivery") ||
                    path.startsWith("/payment") || 
                    path.startsWith("/order") || 
                    path.startsWith("/restaurant") ||
                    path.startsWith("/menu") ;
        }
        return false;
    }

    private Mono<Void> handleUnauthorized(ServerHttpResponse response, String message) {
        logger.warn("Handling unauthorized request: {}", message);
        response.setStatusCode(HttpStatus.FORBIDDEN);
        return response.setComplete();
    }
}
