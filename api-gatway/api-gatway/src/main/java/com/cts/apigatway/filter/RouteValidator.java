package com.cts.apigatway.filter;

import java.util.function.Predicate;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

@Component
public class RouteValidator {

    private static final Logger logger = LoggerFactory.getLogger(RouteValidator.class); // Logger instance

    public static final String[] OPEN_API_ENDPOINTS = { "/auth/register", "/auth/new", "/auth/validate", "/eureka" };

    public Predicate<ServerHttpRequest> isSecured = request -> {
        String path = request.getPath().toString();
        logger.info("Checking security status for request path: {}", path);

        for (String endpoint : OPEN_API_ENDPOINTS) {
            if (path.contains(endpoint)) {
                logger.info("Path '{}' is OPEN, no authentication required.", path);
                return false; // Endpoint does not require authorization
            }
        }

        logger.info("Path '{}' is SECURED, authentication required.", path);
        return true; // Endpoint requires authorization
    };
}
