package com.cts.SecurityServer.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

import com.cts.SecurityServer.entity.*;
import com.cts.SecurityServer.exception.UserNotFound;
import com.cts.SecurityServer.repo.*;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class); // Logger instance

    @Autowired
    private UserInfoRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String addUser(UserInfo userInfo) {
        logger.info("Attempting to add user: {}", userInfo.getName());
        String name = userInfo.getName();
        UserInfo obj1 = repository.findByName(name).orElse(null);

        if (obj1 == null) {
            userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
            repository.save(userInfo);
            logger.info("User {} registered successfully", name);
            return "Registration Successful";
        } else {
            logger.warn("User {} is already registered", name);
            return "This UserName is Already Registered.";
        }
    }

    public String getRoles(String email) {
        logger.info("Fetching roles for email: {}", email);
        UserInfo obj2 = repository.findByEmail(email).orElse(null);
        if (obj2 != null) {
            logger.info("Roles found for email {}: {}", email, obj2.getRoles());
            return obj2.getRoles();
        }
        logger.warn("No roles found for email: {}", email);
        return "Not Found";
    }
    
    public List<UserInfo> getAllUser(){
    	logger.info("Fetching all users");
    	return repository.findAll();
    }

    public UserInfo updateUser(Long userId, UserInfo updatedUser) throws UserNotFound {
        logger.info("Updating user ID: {}", userId);
        Optional<UserInfo> existingUserOpt = repository.findById(userId);
        if (existingUserOpt.isPresent()) {
            UserInfo existingUser = existingUserOpt.get();
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPassword(updatedUser.getPassword());
            existingUser.setRoles(updatedUser.getRoles());
            UserInfo updated = repository.save(existingUser);
            logger.info("User ID {} updated successfully", userId);
            return updated;
        } else {
            logger.error("User ID {} not found, update failed.", userId);
            throw new UserNotFound("User with ID " + userId + " not found");
        }
    }

    public String removeUser(Long userId) throws UserNotFound {
        logger.info("Removing user ID: {}", userId);
        Optional<UserInfo> optional = repository.findById(userId);
        if (optional.isPresent()) {
            repository.deleteById(userId);
            logger.info("User ID {} deleted successfully", userId);
            return "User Deleted";
        } else {
            logger.error("Invalid user ID: {} for deletion", userId);
            throw new UserNotFound("User ID is Invalid...");
        }
    }

//    public UserInfo getUserById(Long userId) throws UserNotFound {
//        logger.info("Fetching user details for ID: {}", userId);
//        Optional<UserInfo> optional = repository.findById(userId);
//        if (optional.isPresent()) {
//            logger.info("User ID {} found", userId);
//            return optional.get();
//        } else {
//            logger.error("User ID {} not found", userId);
//            throw new UserNotFound("User ID is Invalid...");
//        }
//    }

    public Optional<UserInfo> getUserByEmail(String userEmail) {
        logger.info("Fetching user details by email: {}", userEmail);
        return repository.findByEmail(userEmail);
    }
}
