package com.infosys.farmxchain.controller;

import com.infosys.farmxchain.dto.ApiResponse;
import com.infosys.farmxchain.dto.UserDTO;
import com.infosys.farmxchain.security.SecurityUtils;
import com.infosys.farmxchain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUserProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        UserDTO user = userService.getUserById(userId);
        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
                .success(true)
                .message("User profile retrieved successfully")
                .data(user)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long userId) {
        UserDTO user = userService.getUserById(userId);
        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
                .success(true)
                .message("User retrieved successfully")
                .data(user)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserByEmail(@PathVariable String email) {
        UserDTO user = userService.getUserByEmail(email);
        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
                .success(true)
                .message("User retrieved successfully")
                .data(user)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getUsersByRole(@PathVariable String role) {
        List<UserDTO> users = userService.getUsersByRole(role);
        ApiResponse<List<UserDTO>> response = ApiResponse.<List<UserDTO>>builder()
                .success(true)
                .message("Users retrieved successfully")
                .data(users)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        ApiResponse<List<UserDTO>> response = ApiResponse.<List<UserDTO>>builder()
                .success(true)
                .message("All users retrieved successfully")
                .data(users)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/farmers/all")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllFarmers() {
        List<UserDTO> farmers = userService.getAllFarmers();
        ApiResponse<List<UserDTO>> response = ApiResponse.<List<UserDTO>>builder()
                .success(true)
                .message("All farmers retrieved successfully")
                .data(farmers)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/distributors/all")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllDistributors() {
        List<UserDTO> distributors = userService.getAllDistributors();
        ApiResponse<List<UserDTO>> response = ApiResponse.<List<UserDTO>>builder()
                .success(true)
                .message("All distributors retrieved successfully")
                .data(distributors)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/retailers/all")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllRetailers() {
        List<UserDTO> retailers = userService.getAllRetailers();
        ApiResponse<List<UserDTO>> response = ApiResponse.<List<UserDTO>>builder()
                .success(true)
                .message("All retailers retrieved successfully")
                .data(retailers)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/consumers/all")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllConsumers() {
        List<UserDTO> consumers = userService.getAllConsumers();
        ApiResponse<List<UserDTO>> response = ApiResponse.<List<UserDTO>>builder()
                .success(true)
                .message("All consumers retrieved successfully")
                .data(consumers)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("User deleted successfully")
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/top-up")
    public ResponseEntity<ApiResponse<UserDTO>> topUpBalance(@RequestParam java.math.BigDecimal amount) {
        Long userId = SecurityUtils.getCurrentUserId();
        UserDTO user = userService.topUpBalance(userId, amount);
        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
                .success(true)
                .message("Balance topped up successfully")
                .data(user)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
