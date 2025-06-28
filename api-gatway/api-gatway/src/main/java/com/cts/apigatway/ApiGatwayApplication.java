package com.cts.apigatway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

@SpringBootApplication
public class ApiGatwayApplication {

    private static final Logger logger = LoggerFactory.getLogger(ApiGatwayApplication.class); // Logger instance

    public static void main(String[] args) {
        logger.info("Starting API Gateway service...");
        SpringApplication.run(ApiGatwayApplication.class, args);
        logger.info("API Gateway service started successfully!");
    }
}
