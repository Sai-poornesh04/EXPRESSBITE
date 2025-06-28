package com.cts.SecurityServer.controller;

import java.util.List;
import java.util.Optional;

import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

import com.cts.SecurityServer.dto.*;
import com.cts.SecurityServer.entity.*;
import com.cts.SecurityServer.exception.*;
import com.cts.SecurityServer.repo.*;
import com.cts.SecurityServer.service.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
//@CrossOrigin("*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class); // Logger instance

    @Autowired
    private UserService service;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserInfoRepository repo;
    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/welcome") // http://localhost:9090/auth/welcome
    public String welcome() {
        logger.info("Accessing welcome endpoint.");
        return "Welcome, this endpoint is not secure";
    }

    @PostMapping("/new") // http://localhost:9090/auth/new
    public String addNewUser(@RequestBody UserInfo userInfo) {
        logger.info("Adding new user: {}", userInfo.getName());
        return service.addUser(userInfo);
    }

    @PostMapping("/authenticate") // http://localhost:9090/auth/authenticate
    public String authenticateAndGetToken(@RequestBody AuthRequest authRequest) throws AuthenticationException {
        logger.info("Authenticating user: {}", authRequest.getEmail());
        
        Authentication authentication = authenticationManager.authenticate(
		    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

		if (authentication.isAuthenticated()) {
		    UserInfo obj = repo.findByEmail(authRequest.getEmail()).orElse(null);

		    if (obj == null) {
		        logger.warn("User not found for email: {}", authRequest.getEmail());
		        throw new UsernameNotFoundException("User not found: " + authRequest.getEmail());
		    }

		    logger.info("Authentication successful for user: {}", authRequest.getEmail());
		    return jwtService.generateToken(authRequest.getEmail(), obj.getRoles());
		}
        
        throw new UsernameNotFoundException("Unexpected authentication failure.");
    }
    @GetMapping("/getAllUser")
    public List<UserInfo> getAllUser(){
    	logger.info("Fetching all Users...");
    	return service.getAllUser();
    }
    
    @GetMapping("/getroles/{email}") // http://localhost:9090/auth/getroles/{username}
    public String getRoles(@PathVariable String email) {
        logger.info("Fetching roles for email: {}", email);
        return service.getRoles(email);
    }

    @PutMapping("/update/{userId}")
    public UserInfo updateUser(@PathVariable Long userId, @RequestBody @Valid UserInfo updatedUser) throws UserNotFound {
        logger.info("Updating user with ID: {}", userId);
        return service.updateUser(userId, updatedUser);
    }

    @DeleteMapping("/remove/{uid}")
    public String removeUser(@PathVariable("uid") Long userId) throws UserNotFound {
        logger.info("Removing user with ID: {}", userId);
        return service.removeUser(userId);
    }

//    @GetMapping("/fetchById/{uid}")
//    public UserInfo getById(@PathVariable("uid") Long userId) throws UserNotFound {
//        logger.info("Fetching user details for ID: {}", userId);
//        return service.getUserById(userId);
//    }
//
    @GetMapping("/fetchByEmail/{userEmail}")
    public Optional<UserInfo> getByEmail(@PathVariable("userEmail") String userEmail) {
        logger.info("Fetching user details by email: {}", userEmail);
        return service.getUserByEmail(userEmail);
    }
}
