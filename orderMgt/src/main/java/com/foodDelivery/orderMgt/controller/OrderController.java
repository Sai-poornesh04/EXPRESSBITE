package com.foodDelivery.orderMgt.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import com.foodDelivery.orderMgt.dto.OrderRequestDTO;
import com.foodDelivery.orderMgt.Exception.*;
import com.foodDelivery.orderMgt.model.Orders;
import com.foodDelivery.orderMgt.service.OrderServiceInterface;

@RestController
@RequestMapping("/order")
//@CrossOrigin(origins = "http://localhost:5176") // Ensure this matches your frontend URL
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderServiceInterface service;

    @PostMapping("/place")
    public ResponseEntity<Orders> placeOrder(@RequestBody @Validated OrderRequestDTO request) throws Exception {
        logger.info("Placing a new order: {}", request);
        return new ResponseEntity<>(service.placeOrder(request), HttpStatus.CREATED);
    }

    @PostMapping // This endpoint seems redundant if placeOrder(OrderRequestDTO) is primary
    public Orders placeOrder(@RequestBody @Validated Orders order) throws Exception {
        logger.info("Placing an order directly: {}", order);
        return service.placeOrder(order);
    }

    // Updated to accept List<String> for 'statuses'
    @GetMapping("/list")
    public List<Orders> allOrder(
        @RequestParam(required = false) List<String> statuses, // Now expects a list of statuses
        @RequestParam(required = false) String email
    ) throws ResourceNotFoundException {
        logger.info("Fetching orders with statuses: {} and email: {}", statuses, email);
        return service.allOrder(statuses, email); // Pass the list of statuses to the service
    }

    @GetMapping("/{id}")
    public Orders getOrder(@PathVariable Long id) throws ResourceNotFoundException {
        logger.info("Fetching order details for ID: {}", id);
        return service.getOrderById(id);
    }
}
