package com.foodDelivery.orderMgt.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.foodDelivery.orderMgt.dto.MenuItemDTO;


@FeignClient(name="MENUITEMS")
public interface MenuItemClient {
	@GetMapping("menu/viewMenu/{id}")
	public MenuItemDTO getMenuItemById(@PathVariable Long id);
}
