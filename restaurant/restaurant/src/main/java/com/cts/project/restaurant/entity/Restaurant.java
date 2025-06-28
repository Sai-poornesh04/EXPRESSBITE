package com.cts.project.restaurant.entity;

import java.util.List;

import com.cts.project.restaurant.dto.MenuItemsDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long restaurantId;
	private String name;
    private String address;
    private String phoneNumber;
    private String email;
    @Transient 
    private List<MenuItemsDTO> menuItems;
    
}
