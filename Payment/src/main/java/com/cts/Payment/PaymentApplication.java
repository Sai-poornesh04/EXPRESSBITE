package com.cts.Payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

@SpringBootApplication
@EnableFeignClients
public class PaymentApplication {

    private static final Logger logger = LoggerFactory.getLogger(PaymentApplication.class); // Logger instance

    public static void main(String[] args) {
        logger.info("Starting Payment Service...");
        SpringApplication.run(PaymentApplication.class, args);
        logger.info("Payment Service started successfully!");
    }
}
