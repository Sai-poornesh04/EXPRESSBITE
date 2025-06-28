package com.cts.project.menuItems.service;

import java.util.List;

import com.cts.project.menuItems.exception.ResourceNotFoundException;
import com.cts.project.menuItems.model.MenuItems;

public interface MenuItemServiceInterface {
	MenuItems addMenuItem(MenuItems menuItem);
    List<MenuItems> getAllMenuItems() throws ResourceNotFoundException;
    MenuItems getMenuItemById(Long id) throws ResourceNotFoundException;
    List<MenuItems> getMenuItemsByRestaurant(Long restaurantID) throws ResourceNotFoundException;
    MenuItems updateMenuItem(Long id, MenuItems updatedMenuItem) throws ResourceNotFoundException;
    void deleteMenuItem(Long id) throws ResourceNotFoundException;
}
