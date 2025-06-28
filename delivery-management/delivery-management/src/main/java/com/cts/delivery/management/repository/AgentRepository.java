package com.cts.delivery.management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cts.delivery.management.entity.Agent;
@Repository
public interface AgentRepository  extends JpaRepository<Agent, Long> {
	
    Optional<Agent> findFirstByStatus(String status);

}

