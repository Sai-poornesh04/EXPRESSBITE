package com.foodDelivery.orderMgt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemDTO {
	private Long itemId;
	private String name;
	private String description;
	private Double price;
	private Long restaurantID;
}
