package com.cts.delivery.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cts.delivery.management.entity.Delivery;
@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
	List<Delivery> findByStatus(String status);
}
