package com.cts.delivery.management.service;

import java.util.List;

import com.cts.delivery.management.entity.Delivery;
import com.cts.delivery.management.exception.ResourceNotFoundException;

public interface DeliveryService {
	
	List<Delivery> getDeliveries() throws ResourceNotFoundException; 
//	
//    Delivery status(Delivery deliveryRequest);
    //
    Delivery assignAgentToOrder(Long orderId) throws ResourceNotFoundException;
    
    Delivery updateDeliveryStatus(Long deliveryId, String status) throws ResourceNotFoundException;
    
    Delivery getDelivery(Long deliveryId) throws ResourceNotFoundException;


}
