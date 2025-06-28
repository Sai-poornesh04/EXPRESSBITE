package com.cts.Payment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

import com.cts.Payment.dto.PaymentRequest;
import com.cts.Payment.dto.PaymentResponse;
import com.cts.Payment.exception.ResourceNotFoundException;
import com.cts.Payment.service.PaymentServiceInterface;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class); // Logger instance

    @Autowired
    private PaymentServiceInterface paymentService;

    @PostMapping("/process")
    public PaymentResponse processPayment(@RequestBody @Validated PaymentRequest request) throws ResourceNotFoundException{
        logger.info("Processing payment request: {}", request);
        
        PaymentResponse response = paymentService.processPayment(request);
        if (response == null) {
            logger.error("Payment processing failed for request: {}", request);
            throw new ResourceNotFoundException("Payment processing failed for order ID: " + request.getOrderId());
        }
        
        logger.info("Payment processed successfully: {}", response);
        return response;
    }
}
