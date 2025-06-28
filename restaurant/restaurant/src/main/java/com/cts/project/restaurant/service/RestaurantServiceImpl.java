package com.cts.project.restaurant.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

import com.cts.project.restaurant.Client.MenuItemClient;
import com.cts.project.restaurant.dto.MenuItemsDTO;
import com.cts.project.restaurant.entity.Restaurant;
import com.cts.project.restaurant.exception.ResourceNotFoundException;
import com.cts.project.restaurant.repo.RestaurantRepository;

@Service
public class RestaurantServiceImpl implements RestaurantServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantServiceImpl.class); // Logger instance

    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private MenuItemClient menuItemClient;

    @Override
    public List<Restaurant> getAllRestaurants() {
        logger.info("Fetching all restaurants...");
        return restaurantRepository.findAll();
    }

    @Override
    public Restaurant getRestaurantById(Long id) throws ResourceNotFoundException {
        logger.info("Fetching restaurant by ID: {}", id);
        return restaurantRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Restaurant not found for ID: {}", id);
                    return new ResourceNotFoundException("Restaurant with ID " + id + " not found");
                });
    }

    @Override
    public Restaurant addRestaurant(Restaurant restaurant) {
        logger.info("Adding new restaurant: {}", restaurant);
        return restaurantRepository.save(restaurant);
    }

    @Override
    public Restaurant updateRestaurant(Long id, Restaurant updatedRestaurant) throws ResourceNotFoundException {
        logger.info("Updating restaurant ID: {}", id);
        Restaurant existingRestaurant = getRestaurantById(id);

        existingRestaurant.setName(updatedRestaurant.getName());
        existingRestaurant.setAddress(updatedRestaurant.getAddress());
        existingRestaurant.setPhoneNumber(updatedRestaurant.getPhoneNumber());
        existingRestaurant.setEmail(updatedRestaurant.getEmail());

        Restaurant updated = restaurantRepository.save(existingRestaurant);
        logger.info("Restaurant ID {} updated successfully", id);
        return updated;
    }

    @Override
    public Restaurant getRestaurantWithMenu(Long restaurantId) throws ResourceNotFoundException {
        logger.info("Fetching restaurant with menu for ID: {}", restaurantId);
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> {
                    logger.error("Restaurant ID {} not found.", restaurantId);
                    return new ResourceNotFoundException("Restaurant with ID " + restaurantId + " not found");
                });

        List<MenuItemsDTO> menuItems = menuItemClient.getMenuItemsByRestaurant(restaurantId);
        restaurant.setMenuItems(menuItems);

        logger.info("Retrieved restaurant '{}' with {} menu items.", restaurant.getName(), menuItems.size());
        return restaurant;
    }

    @Override
    public void deleteRestaurant(long id) throws ResourceNotFoundException {
        logger.info("Deleting restaurant ID: {}", id);
        if (!restaurantRepository.existsById(id)) {
            logger.error("Restaurant ID {} does not exist, deletion failed.", id);
            throw new ResourceNotFoundException("Restaurant with ID " + id + " does not exist.");
        }
        restaurantRepository.deleteById(id);
        logger.info("Restaurant ID {} deleted successfully", id);
    }
    @Override
    public List<Restaurant> getRestaurantByName(String name) throws ResourceNotFoundException{
        logger.info("Fetching restaurants by name: {}", name);
        
        List<Restaurant> restaurants = restaurantRepository.findByNameContaining(name);
        
        if (restaurants.isEmpty()) {
            logger.warn("No restaurants found for name: {}", name);
            throw new ResourceNotFoundException("No restaurants found with name: " + name);
        }
        
        return restaurants;
    }


}
