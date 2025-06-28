package com.cts.ConfigServer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {

    private static final Logger logger = LoggerFactory.getLogger(ConfigServerApplication.class); // Logger instance

    public static void main(String[] args) {
        logger.info("Starting Config Server...");
        SpringApplication.run(ConfigServerApplication.class, args);
        logger.info("Config Server started successfully!");
    }
}
