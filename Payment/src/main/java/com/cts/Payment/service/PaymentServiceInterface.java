package com.cts.Payment.service;

import com.cts.Payment.dto.PaymentRequest;
import com.cts.Payment.dto.PaymentResponse;
import com.cts.Payment.exception.ResourceNotFoundException;

public interface PaymentServiceInterface {
	 PaymentResponse processPayment(PaymentRequest request) throws ResourceNotFoundException;

}
