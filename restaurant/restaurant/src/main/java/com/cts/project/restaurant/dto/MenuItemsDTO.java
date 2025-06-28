package com.cts.project.restaurant.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemsDTO {
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long itemID;
    private String name;
    private String description;
    private double price;
//    private Long restaurantID;
}
