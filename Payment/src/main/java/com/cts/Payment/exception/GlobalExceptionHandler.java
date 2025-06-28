package com.cts.Payment.exception;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class); // Logger instance

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        logger.warn("Validation failure: {}", ex.getMessage());

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", new Date());
        
        // Get all errors and log them
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String field = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            body.put(field, message);
            logger.warn("Validation error in field '{}' - {}", field, message);
        });

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleResourceNotFoundException(ResourceNotFoundException exception, WebRequest webRequest) {
        logger.error("ResourceNotFoundException: {}", exception.getMessage());

        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.setStatus(404);
        exceptionResponse.setTime(LocalDateTime.now());
        exceptionResponse.setMessage(exception.getMessage());

        return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleGenericException(Exception exception, WebRequest webRequest) {
        logger.error("Unhandled exception: {}", exception.getMessage(), exception);

        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.setStatus(500); // Changed from 404 to 500 for general exceptions
        exceptionResponse.setTime(LocalDateTime.now());
        exceptionResponse.setMessage(exception.getMessage());

        return new ResponseEntity<>(exceptionResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
