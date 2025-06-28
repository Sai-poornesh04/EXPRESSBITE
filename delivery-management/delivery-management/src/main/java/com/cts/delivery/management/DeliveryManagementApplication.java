package com.cts.delivery.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

@SpringBootApplication
@EnableFeignClients
@EnableScheduling
public class DeliveryManagementApplication {

    private static final Logger logger = LoggerFactory.getLogger(DeliveryManagementApplication.class); // Logger instance

    public static void main(String[] args) {
        logger.info("Starting Delivery Management Service...");
        SpringApplication.run(DeliveryManagementApplication.class, args);
        logger.info("Delivery Management Service started successfully!");
    }
}
