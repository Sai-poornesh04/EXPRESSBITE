package com.foodDelivery.orderMgt.Exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

public class ResourceNotFoundException extends Exception {

    private static final Logger logger = LoggerFactory.getLogger(ResourceNotFoundException.class); // Logger instance

    public ResourceNotFoundException(String message) {
        super(message);
        logger.error("ResourceNotFoundException: {}", message); // Log the exception message
    }
}
