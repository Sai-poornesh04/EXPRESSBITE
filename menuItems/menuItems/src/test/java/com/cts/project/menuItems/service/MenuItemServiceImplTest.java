package com.cts.project.menuItems.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test; 
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.cts.project.menuItems.exception.ResourceNotFoundException;
import com.cts.project.menuItems.model.MenuItems;
import com.cts.project.menuItems.repo.MenuItemRepository;
import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class MenuItemServiceImplTest {

    @Mock
    private MenuItemRepository menuItemRepository;

    @InjectMocks
    private MenuItemServiceImpl menuItemService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddMenuItem() {
        MenuItems menuItem = new MenuItems(1L,"Pasta", "Delicious Italian pasta", 12.99,1L);
        when(menuItemRepository.save(menuItem)).thenReturn(menuItem);

        MenuItems savedItem = menuItemService.addMenuItem(menuItem);

        assertNotNull(savedItem);
        assertEquals("Pasta", savedItem.getName());
        verify(menuItemRepository, times(1)).save(menuItem);
    }

    @Test
    void testGetAllMenuItems() throws ResourceNotFoundException {
        MenuItems menuItem1 = new MenuItems(1L, "Pasta", "Delicious Italian pasta", 12.99,1L);
        MenuItems menuItem2 = new MenuItems(2L, "Pizza", "Cheesy pizza", 10.99,1L);
        when(menuItemRepository.findAll()).thenReturn(Arrays.asList(menuItem1, menuItem2));

        List<MenuItems> items = menuItemService.getAllMenuItems();

        assertEquals(2, items.size());
        verify(menuItemRepository, times(1)).findAll();
    }

    @Test
    void testGetMenuItemById_Success() throws ResourceNotFoundException {
        MenuItems menuItem = new MenuItems(1L, "Burger", "Juicy beef burger", 8.99,1L);
        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(menuItem));

        MenuItems foundItem = menuItemService.getMenuItemById(1L);

        assertNotNull(foundItem);
        assertEquals("Burger", foundItem.getName());
        verify(menuItemRepository, times(1)).findById(1L);
    }

    @Test
    void testGetMenuItemById_NotFound() {
        when(menuItemRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> menuItemService.getMenuItemById(1L));
    }

    @Test
    void testDeleteMenuItem() throws ResourceNotFoundException {
        when(menuItemRepository.existsById(1L)).thenReturn(true);
        doNothing().when(menuItemRepository).deleteById(1L);

        menuItemService.deleteMenuItem(1L);

        verify(menuItemRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteMenuItem_NotFound() {
        when(menuItemRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> menuItemService.deleteMenuItem(1L));
    }
}

