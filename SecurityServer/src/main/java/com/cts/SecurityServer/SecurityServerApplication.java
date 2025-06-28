package com.cts.SecurityServer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

@SpringBootApplication
public class SecurityServerApplication {

    private static final Logger logger = LoggerFactory.getLogger(SecurityServerApplication.class); // Logger instance

    public static void main(String[] args) {
        logger.info("Starting Security Server...");
        SpringApplication.run(SecurityServerApplication.class, args);
        logger.info("Security Server started successfully!");
    }
}
