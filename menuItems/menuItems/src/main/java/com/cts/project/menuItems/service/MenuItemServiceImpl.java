package com.cts.project.menuItems.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

import com.cts.project.menuItems.exception.ResourceNotFoundException;
import com.cts.project.menuItems.model.MenuItems;
import com.cts.project.menuItems.repo.MenuItemRepository;

@Service
public class MenuItemServiceImpl implements MenuItemServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(MenuItemServiceImpl.class); // Logger instance

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public MenuItems addMenuItem(MenuItems menuItem) {
        logger.info("Adding new menu item: {}", menuItem);
        return menuItemRepository.save(menuItem);
    }

    @Override
    public List<MenuItems> getAllMenuItems() throws ResourceNotFoundException {
        logger.info("Fetching all menu items...");
        List<MenuItems> menuItems = menuItemRepository.findAll();

        if (menuItems.isEmpty()) {
            logger.warn("No menu items found in the database.");
            throw new ResourceNotFoundException("No menu items found.");
        }

        logger.info("Retrieved {} menu items.", menuItems.size());
        return menuItems;
    }

    @Override
    public MenuItems getMenuItemById(Long id) throws ResourceNotFoundException {
        logger.info("Fetching menu item by ID: {}", id);
        return menuItemRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Menu Item with ID {} not found.", id);
                    return new ResourceNotFoundException("Menu Item with ID " + id + " not found.");
                });
    }

    @Override
    public List<MenuItems> getMenuItemsByRestaurant(Long restaurantID) throws ResourceNotFoundException {
        logger.info("Fetching menu items for restaurant ID: {}", restaurantID);
        List<MenuItems> menuItems = menuItemRepository.findByRestaurantID(restaurantID);

        if (menuItems.isEmpty()) {
            logger.warn("No menu items found for restaurant ID: {}", restaurantID);
            throw new ResourceNotFoundException("No menu items found for restaurant ID: " + restaurantID);
        }

        return menuItems;
    }

    @Override
    public MenuItems updateMenuItem(Long id, MenuItems updatedMenuItem) throws ResourceNotFoundException {
        logger.info("Updating menu item ID: {}", id);
        MenuItems existingItem = getMenuItemById(id);

        existingItem.setName(updatedMenuItem.getName());
        existingItem.setDescription(updatedMenuItem.getDescription());
        existingItem.setPrice(updatedMenuItem.getPrice());

        MenuItems updatedItem = menuItemRepository.save(existingItem);
        logger.info("Updated menu item ID {} successfully.", id);
        return updatedItem;
    }

    @Override
    public void deleteMenuItem(Long id) throws ResourceNotFoundException {
        logger.info("Deleting menu item ID: {}", id);
        if (!menuItemRepository.existsById(id)) {
            logger.error("Menu item ID {} does not exist, deletion failed.", id);
            throw new ResourceNotFoundException("Menu item with ID " + id + " does not exist.");
        }
        menuItemRepository.deleteById(id);
        logger.info("Menu item ID {} deleted successfully.", id);
    }
}
