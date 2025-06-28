package com.foodDelivery.orderMgt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.foodDelivery.orderMgt.model.Orders;
import java.util.List;

public interface OrderRepository extends JpaRepository<Orders, Long> {
    // Old method for single status (can be kept but not used by new frontend logic)
    List<Orders> findByStatus(String status);
    
    // New: Find by a list of statuses
    List<Orders> findByStatusIn(List<String> statuses);

    // Old method for single status and email (can be kept but not used by new frontend logic)
    List<Orders> findByStatusAndEmail(String status, String email);

    // New: Find by email and a list of statuses
    List<Orders> findByEmailAndStatusIn(String email, List<String> statuses);

    // New: Find all orders by email (for when no statuses are filtered for a user)
    List<Orders> findByEmail(String email);
}
