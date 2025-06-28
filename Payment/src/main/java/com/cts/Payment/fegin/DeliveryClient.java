package com.cts.Payment.fegin;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "delivery-management")
public interface DeliveryClient {
	
	@PostMapping("/delivery/assign/{orderId}")
	// Sends a request to assign a delivery agent to an order
	void assign(@RequestParam Long orderId);

}

