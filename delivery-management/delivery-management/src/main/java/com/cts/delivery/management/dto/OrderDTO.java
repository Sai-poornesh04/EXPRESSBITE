package com.cts.delivery.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
	
	private Long orderId;
	private Long userId;
	private Long restaurantId;
	private String status;
	private Double totalAmount;

}
