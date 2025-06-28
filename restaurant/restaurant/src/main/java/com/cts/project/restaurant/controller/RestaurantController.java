package com.cts.project.restaurant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

import com.cts.project.restaurant.dto.MenuItemsDTO;
import com.cts.project.restaurant.entity.Restaurant;
import com.cts.project.restaurant.exception.ResourceNotFoundException;
import com.cts.project.restaurant.service.RestaurantServiceImpl;

@RestController
@RequestMapping("/restaurant")
public class RestaurantController {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantController.class); // Logger instance

    @Autowired
    private RestaurantServiceImpl restaurantService;

    @PostMapping("/addRestaurant")
    public ResponseEntity<Restaurant> addRestaurant(@RequestBody Restaurant restaurant) {
        logger.info("Adding new restaurant: {}", restaurant);
        return new ResponseEntity<>(restaurantService.addRestaurant(restaurant), HttpStatus.CREATED);
    }

    @GetMapping("/viewAllRestaurant")
    public ResponseEntity<List<Restaurant>> getRestaurant() {
        logger.info("Fetching all restaurants...");
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/viewRestaurantById/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) throws ResourceNotFoundException {
        logger.info("Fetching restaurant by ID: {}", id);
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(restaurant);
    }
    
    @GetMapping("viewRestaurantByName/{name}")
    public ResponseEntity<List<Restaurant>> getRestaurantByName(@PathVariable String name) throws ResourceNotFoundException {
    	logger.info("Fetching restaurant by Name: {}", name);
    	List<Restaurant> restaurant = restaurantService.getRestaurantByName(name);
    	return ResponseEntity.ok(restaurant);
    }

    @PutMapping("/updateRestaurant/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant restaurant) throws ResourceNotFoundException {
        logger.info("Updating restaurant ID: {}", id);
        return new ResponseEntity<>(restaurantService.updateRestaurant(id, restaurant), HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/deleteRestaurant/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) throws ResourceNotFoundException {
        logger.info("Deleting restaurant ID: {}", id);
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantWithMenu(@PathVariable Long id) throws ResourceNotFoundException {
        logger.info("Fetching restaurant with menu for ID: {}", id);
        Restaurant restaurant = restaurantService.getRestaurantWithMenu(id);
        return new ResponseEntity<>(restaurant, HttpStatus.FOUND);
        
    }
    
    // @PostMapping("/{restaurantId}/menuItem") 
    // public ResponseEntity<MenuItemsDTO> addMenuItemToRestaurant(@PathVariable Long restaurantId, @RequestBody MenuItemsDTO menuItem) { 
    // MenuItemsDTO createdMenuItem = restaurantService.addMenuItemToRestaurant(restaurantId, menuItem); 
    // return new ResponseEntity<>(createdMenuItem, HttpStatus.CREATED); 
    // }
}
