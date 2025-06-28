package com.foodDelivery.orderMgt.service;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.foodDelivery.orderMgt.dto.MenuItemDTO;
import com.foodDelivery.orderMgt.dto.OrderRequestDTO;
import com.foodDelivery.orderMgt.Exception.*;
import com.foodDelivery.orderMgt.feign.MenuItemClient;
import com.foodDelivery.orderMgt.model.Orders;
import com.foodDelivery.orderMgt.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderRepository repository;

    @Autowired
    private MenuItemClient menuClient;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    // Assuming you have an OrderStatus enum, define it or handle strings consistently
    // For simplicity, we'll use strings and assume backend's DB stores them as strings
    // If you have an enum, you'd convert `List<String>` to `List<OrderStatus>` here.

    @Override
    public Orders placeOrder(OrderRequestDTO request) throws ResourceNotFoundException {
        logger.info("Placing order for user ID: {} with item ID: {}", request.getUserId(), request.getItemId());
        MenuItemDTO item = menuClient.getMenuItemById(request.getItemId());

        if (item == null) {
            logger.error("Menu item not found for ID: {}", request.getItemId());
            throw new ResourceNotFoundException("Menu item with ID " + request.getItemId() + " not found.");
        }

        Orders order = new Orders();
        order.setRestaurantID(item.getRestaurantID());
        order.setTotalAmount(item.getPrice());
        order.setStatus("PENDING"); // Initial status
        order.setEmail(request.getEmail()); // Ensure email is set from request
        Orders savedOrder = repository.save(order);

        logger.info("Order placed successfully with ID: {}", savedOrder.getOrderId());

        // Schedule status update after 30 seconds
        scheduler.schedule(() -> {
            // Re-fetch order to ensure it's not detached or stale
            repository.findById(savedOrder.getOrderId()).ifPresent(o -> {
                o.setStatus("DELIVERED");
                repository.save(o);
                logger.info("Order ID: {} status updated to DELIVERED by scheduler", o.getOrderId());
            });
        }, 30, TimeUnit.SECONDS);

        return savedOrder;
    }

    @Override // This overloaded method seems problematic, consider removing it
    public Orders placeOrder(Orders order) throws ResourceNotFoundException {
        // This method bypasses MenuItem lookup and sets status to "Pending" (lowercase)
        // Ensure consistency with "PENDING" (uppercase) used elsewhere.
        order.setStatus("PENDING"); // Changed to uppercase for consistency
        Orders savedOrder = repository.save(order);
        logger.info("Order placed directly successfully with ID: {}", savedOrder.getOrderId());
        return savedOrder;
    }

    @Override
    public Orders getOrderById(Long id) throws ResourceNotFoundException {
        logger.info("Fetching order details for ID: {}", id);
        return repository.findById(id).orElseThrow(() -> {
            logger.error("Order not found with ID: {}", id);
            return new ResourceNotFoundException("Order with ID " + id + " not found.");
        });
    }

    // Updated allOrder method to handle List<String> statuses
    @Override
    public List<Orders> allOrder(List<String> statuses, String email) throws ResourceNotFoundException {
        logger.info("Service: Fetching orders with statuses: {} and email: {}", statuses, email);

        boolean hasStatuses = statuses != null && !statuses.isEmpty();
        boolean hasEmail = email != null && !email.trim().isEmpty();

        if (hasStatuses && hasEmail) {
            // Fetch by email and a list of statuses
            return repository.findByEmailAndStatusIn(email, statuses);
        } else if (hasStatuses) {
            // Fetch only by a list of statuses (e.g., for Admin viewing certain types)
            return repository.findByStatusIn(statuses);
        } else if (hasEmail) {
            // Fallback for getting all orders for a specific user if no statuses are provided
            // Based on frontend logic, this path might not be taken often as statuses are always sent
            // For robustness, returning all orders for that email
            return repository.findByEmail(email);
        } else {
            // If neither statuses nor email are provided, return all orders (Admin or default)
            return repository.findAll();
        }
    }

    // Scheduled task remains the same, updates PENDING to DELIVERED
    @Scheduled(fixedDelay = 30000) // Runs every 30 seconds
    public void updatePendingOrders() {
        List<Orders> pendingOrders = repository.findByStatus("PENDING");
        for (Orders order : pendingOrders) {
            order.setStatus("DELIVERED");
            repository.save(order);
            logger.info("Order ID: {} status updated to DELIVERED by scheduled task", order.getOrderId());
        }
    }
}
