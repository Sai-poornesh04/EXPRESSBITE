package com.cts.project.restaurant.service;

import java.util.List;

import com.cts.project.restaurant.dto.MenuItemsDTO;
import com.cts.project.restaurant.entity.Restaurant;
import com.cts.project.restaurant.exception.ResourceNotFoundException;

public interface RestaurantServiceInterface {
	List<Restaurant> getAllRestaurants();
    Restaurant getRestaurantById(Long id) throws ResourceNotFoundException;
    Restaurant addRestaurant(Restaurant restaurant);
    Restaurant updateRestaurant(Long id, Restaurant updatedRestaurant) throws ResourceNotFoundException;
    Restaurant getRestaurantWithMenu(Long restaurantId) throws ResourceNotFoundException;
    void deleteRestaurant(long id) throws ResourceNotFoundException;
//	MenuItemsDTO addMenuItemToRestaurant(Long restaurantId, MenuItemsDTO menuItem);
    public List<Restaurant> getRestaurantByName(String name) throws ResourceNotFoundException;
}
