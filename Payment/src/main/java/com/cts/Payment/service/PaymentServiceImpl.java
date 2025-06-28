package com.cts.Payment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

import com.cts.Payment.dto.PaymentRequest;
import com.cts.Payment.dto.PaymentResponse;
import com.cts.Payment.entity.Payment;
import com.cts.Payment.exception.ResourceNotFoundException;
import com.cts.Payment.fegin.DeliveryClient;
import com.cts.Payment.repo.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class); // Logger instance

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private DeliveryClient deliveryClient;

    @Override
    public PaymentResponse processPayment(PaymentRequest request) throws ResourceNotFoundException{
        logger.info("Processing payment for Order ID: {}", request.getOrderId());

        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(request.getAmount());

        boolean isPaymentSuccess = true; // mock result

        if (isPaymentSuccess) {
            payment.setStatus("Successful");
            paymentRepo.save(payment);
            logger.info("Payment successful for Order ID: {}. Notifying delivery service.", request.getOrderId());

            deliveryClient.assign(request.getOrderId());
            return new PaymentResponse("Payment Successful. Delivery Assigned.", "Successful");
        } else {
            payment.setStatus("Failed");
            paymentRepo.save(payment);
            logger.error("Payment failed for Order ID: {}", request.getOrderId());
            throw new ResourceNotFoundException("Payment processing failed for Order ID: " + request.getOrderId());
        }
    }
}
