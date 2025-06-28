package com.cts.delivery.management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Agent_info")
public class Agent {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long agentId;
	
	@NotBlank(message = "Name cannot be blank")
    private String name;
    
    @NotBlank(message = "Phone number cannot be blank")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;
    
    @NotBlank(message = "Status cannot be blank")
    private String status; 

}