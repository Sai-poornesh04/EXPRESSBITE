package com.foodDelivery.orderMgt.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
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
public class Orders{
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long orderId;
	private Long restaurantID;
	@NotBlank(message = "Name cannot be blank")
	private String status;
	@NotNull(message = "Total amount cannot be null")
	@Positive(message = "Total amount must be positive")
	private Double totalAmount;
	@Email(message = "Invalid email format")
	@NotBlank(message = "Email cannot be blank")
	private String email;
}
