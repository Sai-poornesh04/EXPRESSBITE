package com.cts.SecurityServer.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

public class UserNotFound extends Exception {

    private static final Logger logger = LoggerFactory.getLogger(UserNotFound.class); // Logger instance

    public UserNotFound(String message) {
        super(message);
        logger.error("UserNotFoundException: {}", message); // Log the exception message
    }
}
