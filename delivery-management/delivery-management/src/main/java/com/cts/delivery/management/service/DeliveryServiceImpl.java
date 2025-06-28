package com.cts.delivery.management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// !!! IMPORTANT: Ensure this import statement is present and correct !!!
import com.cts.delivery.management.entity.Delivery;
import com.cts.delivery.management.entity.Agent; // Also ensure Agent is imported if not already

import com.cts.delivery.management.exception.ResourceNotFoundException;
import com.cts.delivery.management.repository.DeliveryRepository;

@Service
public class DeliveryServiceImpl implements DeliveryService {

    private static final Logger logger = LoggerFactory.getLogger(DeliveryServiceImpl.class);

    @Autowired
    private DeliveryRepository deliveryRepo;
    
    @Autowired
    private AgentService agentService;
    
    @Override
    public List<Delivery> getDeliveries() throws ResourceNotFoundException {
        logger.info("Fetching all deliveries...");
        List<Delivery> deliveries = deliveryRepo.findAll();

        if (deliveries.isEmpty()) {
            logger.warn("No deliveries found.");
            throw new ResourceNotFoundException("No deliveries found.");
        }

        logger.info("Retrieved {} deliveries.", deliveries.size());
        return deliveries;
    }

    @Override
    public Delivery assignAgentToOrder(Long orderId) throws ResourceNotFoundException {
        logger.info("Assigning agent to order ID: {}", orderId);
        Agent agent = agentService.getAvailableAgent();

        if (agent == null) {
            logger.error("No available agents for order ID: {}", orderId);
            throw new ResourceNotFoundException("No available agents for order ID: " + orderId);
        }

        agentService.updateAgentStatus(agent.getAgentId(), "Busy");

        Delivery delivery = new Delivery();
        delivery.setOrderId(orderId);
        delivery.setAgentId(agent.getAgentId());
        delivery.setStatus("In Progress");
        Delivery savedDelivery = deliveryRepo.save(delivery);

        logger.info("Order {} assigned to agent {} and marked 'In Progress'. Delivery ID: {}", orderId, agent.getAgentId(), savedDelivery.getDeliveryId());
        return savedDelivery;
    }

    @Override
    public Delivery updateDeliveryStatus(Long deliveryId, String status) throws ResourceNotFoundException {
        logger.info("Updating delivery status for ID: {} to {}", deliveryId, status);
        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> {
                    logger.error("Delivery ID {} not found.", deliveryId);
                    return new ResourceNotFoundException("Delivery with ID " + deliveryId + " not found.");
                });

        delivery.setStatus(status);
        Delivery updated = deliveryRepo.save(delivery);
        logger.info("Updated delivery ID {} to status '{}'", deliveryId, status);

        if ("Delivered".equalsIgnoreCase(status)) {
            agentService.updateAgentStatus(delivery.getAgentId(), "Available");
            logger.info("Agent {} marked as 'Available' after successful delivery.", delivery.getAgentId());
        }

        return updated;
    }

    @Override
    public Delivery getDelivery(Long deliveryId) throws ResourceNotFoundException {
        logger.info("Fetching delivery details for ID: {}", deliveryId);
        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> {
                    logger.error("Delivery ID {} not found.", deliveryId);
                    return new ResourceNotFoundException("Delivery with ID " + deliveryId + " not found.");
                });

        logger.info("Delivery details retrieved: {}", delivery);
        return delivery;
    }
}
