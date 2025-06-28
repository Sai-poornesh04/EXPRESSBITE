package com.foodDelivery.orderMgt.service;

import java.util.List;

import com.foodDelivery.orderMgt.Exception.ResourceNotFoundException;
import com.foodDelivery.orderMgt.dto.OrderRequestDTO;
import com.foodDelivery.orderMgt.model.Orders;

public interface OrderServiceInterface {
    Orders placeOrder(OrderRequestDTO request) throws ResourceNotFoundException;
    Orders placeOrder(Orders order) throws ResourceNotFoundException; // Consider if this overload is truly needed
    Orders getOrderById(Long id) throws ResourceNotFoundException;

    // Updated method signature to accept List<String> for statuses
    List<Orders> allOrder(List<String> statuses, String email) throws ResourceNotFoundException;
}
