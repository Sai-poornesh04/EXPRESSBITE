// AgentServiceImpl.java
package com.cts.delivery.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cts.delivery.management.entity.Agent;
import com.cts.delivery.management.exception.ResourceNotFoundException;
import com.cts.delivery.management.repository.AgentRepository;

@Service
public class AgentServiceImpl implements AgentService {

    private static final Logger logger = LoggerFactory.getLogger(AgentServiceImpl.class);

    @Autowired
    private AgentRepository agentRepo;

    @Override
    public Agent getAvailableAgent() {
        logger.info("Fetching available agent...");
        return agentRepo.findFirstByStatus("Available")
                .orElseThrow(() -> {
                    logger.error("No available agents found.");
                    return new RuntimeException("No available agents");
                });
    }

    @Override
    public void updateAgentStatus(Long agentId, String status) {
        logger.info("Updating status of agent with ID {} to {}", agentId, status);
        Agent agent = agentRepo.findById(agentId)
                .orElseThrow(() -> {
                    logger.error("Agent with ID {} not found.", agentId);
                    return new RuntimeException("Agent not found");
                });
        agent.setStatus(status);
        agentRepo.save(agent);
        logger.info("Successfully updated agent status.");
    }

    @Override
    public Agent getAgent(Long agentId) throws ResourceNotFoundException {
        logger.info("Fetching agent details for ID: {}", agentId);
        return agentRepo.findById(agentId)
                .orElseThrow(() -> {
                    logger.error("Agent with ID {} not found.", agentId);
                    return new ResourceNotFoundException("Agent with ID " + agentId + " not found.");
                });
    }
}
