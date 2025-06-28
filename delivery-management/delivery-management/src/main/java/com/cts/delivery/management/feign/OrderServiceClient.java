package com.cts.delivery.management.feign;

import com.cts.delivery.management.dto.OrderDTO;
import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

@FeignClient(name = "order-Mgmt")
public interface OrderServiceClient {

    Logger logger = LoggerFactory.getLogger(OrderServiceClient.class); // Logger instance

    @GetMapping("order/list")
    default List<OrderDTO> allOrder() {
        logger.info("Calling Order Service to retrieve all orders...");
        List<OrderDTO> orders = fetchOrders();
        logger.info("Retrieved {} orders from Order Service", orders.size());
        return orders;
    }

    private List<OrderDTO> fetchOrders() {
        return null; // This method should be implemented with actual Feign client behavior
    }
}

//package com.cts.delivery.management.feign;
//
//import com.cts.delivery.management.dto.OrderDTO;
//import java.util.List;
//
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.web.bind.annotation.GetMapping;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory; // Logger instance
//
//@FeignClient(name = "order-Mgmt", url = "http://localhost:8083")
//public interface OrderServiceClient {
//
//    Logger logger = LoggerFactory.getLogger(OrderServiceClient.class); // Logger instance
//
//    @GetMapping("order/list")
//    public List<OrderDTO> allOrder();
//}
