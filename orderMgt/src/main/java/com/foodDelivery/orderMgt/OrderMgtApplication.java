package com.foodDelivery.orderMgt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

@SpringBootApplication
@EnableFeignClients
@EnableScheduling
public class OrderMgtApplication {

    private static final Logger logger = LoggerFactory.getLogger(OrderMgtApplication.class); // Logger instance

    public static void main(String[] args) {
        logger.info("Starting Order Management Service...");
        SpringApplication.run(OrderMgtApplication.class, args);
        logger.info("Order Management Service started successfully!");
    }
}
