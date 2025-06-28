package com.cts.project.menuItems.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cts.project.menuItems.model.MenuItems;

public interface MenuItemRepository extends JpaRepository<MenuItems, Long> {
	List<MenuItems> findByRestaurantID(Long restaurantID);
}
