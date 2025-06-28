package com.cts.delivery.management.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cts.delivery.management.dto.OrderDTO;
import com.cts.delivery.management.entity.Agent;
import com.cts.delivery.management.entity.Delivery;
import com.cts.delivery.management.exception.ResourceNotFoundException;
import com.cts.delivery.management.feign.OrderServiceClient;
import com.cts.delivery.management.service.AgentService;
import com.cts.delivery.management.service.DeliveryService;

@RestController
@RequestMapping("/delivery")
public class DeliveryController {

    private static final Logger logger = LoggerFactory.getLogger(DeliveryController.class);

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private AgentService agentService;

    @Autowired
    private OrderServiceClient orderserviceClient;

    @GetMapping("/orders")
    public List<OrderDTO> allOrder() throws ResourceNotFoundException {
        logger.info("Fetching all orders from OrderServiceClient");
        List<OrderDTO> orders = orderserviceClient.allOrder();
        logger.info("Retrieved {} orders", orders.size());
        return orders;
    }

    @GetMapping("/all")
    public List<Delivery> getDeliveries() throws ResourceNotFoundException {
        logger.info("Fetching all deliveries");
        List<Delivery> deliveries = deliveryService.getDeliveries();
        if (deliveries.isEmpty()) {
            logger.warn("No deliveries found.");
        }
        logger.info("Retrieved {} deliveries", deliveries.size());
        return deliveries;
    }

    @PostMapping("/assign/{orderId}")
    public Delivery assign(@PathVariable Long orderId) throws ResourceNotFoundException {
        logger.info("Assigning agent for Order ID: {}", orderId);
        Delivery assignedDelivery = deliveryService.assignAgentToOrder(orderId);
        logger.info("Assignment successful. Delivery: {}", assignedDelivery);
        return assignedDelivery;
    }

    @PutMapping("/{id}/status")
    public Delivery updateStatus(@PathVariable Long id, @RequestParam String status) throws ResourceNotFoundException {
        logger.info("Updating delivery status for ID: {} to {}", id, status);
        Delivery updatedDelivery = deliveryService.updateDeliveryStatus(id, status);
        logger.info("Updated delivery: {}", updatedDelivery);
        return updatedDelivery;
    }

    @GetMapping("/{id}")
    public Delivery get(@PathVariable("id") Long id) throws ResourceNotFoundException {
        logger.info("Fetching delivery details for ID: {}", id);
        Delivery delivery = deliveryService.getDelivery(id);
        if (delivery != null) {
            logger.info("Delivery found: {}", delivery);
        } else {
            logger.warn("No delivery found for ID: {}", id);
        }
        return delivery;
    }

    @GetMapping("/agent/{agentId}")
    public Agent getAgent(@PathVariable("agentId") Long agentId) throws ResourceNotFoundException {
        logger.info("Fetching agent details for ID: {}", agentId);
        Agent agent = agentService.getAgent(agentId);
        if (agent != null) {
            logger.info("Agent found: {}", agent);
        } else {
            logger.warn("No agent found for ID: {}", agentId);
        }
        return agent;
    }
}
