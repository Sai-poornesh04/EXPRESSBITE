package com.cts.project.menuItems.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
//import jakarta.persistence.Table;
import lombok.Data;

import lombok.NoArgsConstructor;

//@Table(name = "")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItems {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long itemID;
	@Column(nullable = false)
	private String name;
	private String description;
	@Column(nullable = false)
	private double price;
	private Long restaurantID;

}
