package com.cts.delivery.management.service;

import com.cts.delivery.management.entity.Agent;
import com.cts.delivery.management.exception.ResourceNotFoundException;

public interface AgentService {
	
	Agent getAvailableAgent();
    void updateAgentStatus(Long agentId, String status);
    Agent getAgent(Long agentId) throws ResourceNotFoundException;
}
