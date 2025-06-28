package com.cts.project.menuItems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

@SpringBootApplication
public class MenuItemsApplication {

    private static final Logger logger = LoggerFactory.getLogger(MenuItemsApplication.class); // Logger instance

    public static void main(String[] args) {
        logger.info("Starting Menu Items Service...");
        SpringApplication.run(MenuItemsApplication.class, args);
        logger.info("Menu Items Service started successfully!");
    }
}
