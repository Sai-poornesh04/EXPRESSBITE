package com.cts.Payment.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment_info")
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long paymentId;
	private Long orderId;

	@NotBlank(message = "Payment method cannot be blank")
	private String paymentMethod;

	@NotNull(message = "Amount cannot be null")
	@Positive(message = "Amount must be positive")
	private Double amount;

	@NotBlank(message = "Status cannot be blank")
	private String status; // Successful or Failed

}

