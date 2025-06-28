package com.cts.project.menuItems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // Import SLF4J Logger

import com.cts.project.menuItems.exception.ResourceNotFoundException;
import com.cts.project.menuItems.model.MenuItems;
import com.cts.project.menuItems.service.MenuItemServiceImpl;

@RestController
@RequestMapping("/menu")
public class MenuItemController {

    private static final Logger logger = LoggerFactory.getLogger(MenuItemController.class); // Logger instance

    @Autowired
    private MenuItemServiceImpl menuItemService;

    @PostMapping("/addMenu")
    public ResponseEntity<MenuItems> addMenuItem(@RequestBody MenuItems menuItem) {
        logger.info("Adding new menu item: {}", menuItem);
        return new ResponseEntity<>(menuItemService.addMenuItem(menuItem), HttpStatus.CREATED);
    }

    @GetMapping("/viewMenu/{id}")
    public ResponseEntity<MenuItems> getMenuItemById(@PathVariable Long id) throws ResourceNotFoundException{
        logger.info("Fetching menu item by ID: {}", id);
        return ResponseEntity.ok(menuItemService.getMenuItemById(id)) ;
    }

    @GetMapping("/viewMenu")
    public ResponseEntity<List<MenuItems>> getMenuItem() throws ResourceNotFoundException{
        logger.info("Fetching all menu items...");
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }

    @GetMapping("/menuItems/{restaurantID}")
    public ResponseEntity<List<MenuItems>> getMenuItemsByRestaurant(@PathVariable Long restaurantID) throws ResourceNotFoundException{
        logger.info("Fetching menu items for restaurant ID: {}", restaurantID);
        return ResponseEntity.ok(menuItemService.getMenuItemsByRestaurant(restaurantID));
    }

    @PutMapping("/updateMenu/{id}")
    public ResponseEntity<MenuItems> updateMenuItem(@PathVariable Long id, @RequestBody MenuItems updatedMenuItem) throws ResourceNotFoundException{
        logger.info("Updating menu item ID: {}", id);
        return ResponseEntity.ok(menuItemService.updateMenuItem(id, updatedMenuItem));
    }

    @DeleteMapping("/deleteMenu/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) throws ResourceNotFoundException{
        logger.info("Deleting menu item ID: {}", id);
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
