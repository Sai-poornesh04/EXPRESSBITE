package com.cts.Payment.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cts.Payment.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
