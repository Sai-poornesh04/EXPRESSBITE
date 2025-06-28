package com.cts.project.restaurant.Client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.cts.project.restaurant.dto.MenuItemsDTO;

@FeignClient(name = "menuItems")
public interface MenuItemClient {

    @GetMapping("/menu/menuItems/{restaurantId}")
    List<MenuItemsDTO> getMenuItemsByRestaurant(@PathVariable Long restaurantId);
    
//    @PostMapping("/addMenu")
//    MenuItemsDTO addMenuItem(@RequestParam("restaurantId") Long restaurantId, @RequestBody MenuItemsDTO menuItem);
}
