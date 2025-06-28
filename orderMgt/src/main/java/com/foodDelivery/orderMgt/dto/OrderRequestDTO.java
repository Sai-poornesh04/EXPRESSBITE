package com.foodDelivery.orderMgt.dto;

import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {
	@NotNull
	private Long userId;
	private Long itemId;
	private String email;
}
