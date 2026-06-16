package com.infosys.farmxchain.controller;

import com.infosys.farmxchain.dto.ApiResponse;
import com.infosys.farmxchain.dto.FarmerDTO;
import com.infosys.farmxchain.dto.UserDTO;
import com.infosys.farmxchain.dto.OrderDTO;
import com.infosys.farmxchain.dto.FarmerVerificationRequest;
import com.infosys.farmxchain.entity.FarmerVerificationStatus;
import com.infosys.farmxchain.security.SecurityUtils;
import com.infosys.farmxchain.service.FarmerService;
import com.infosys.farmxchain.service.OrderService;
import com.infosys.farmxchain.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private FarmerService farmerService;

    @Autowired
    private OrderService orderService;

    // User Management Endpoints
    @GetMapping("/users")
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

    @GetMapping("/users/pending")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getPendingUsers() {
        List<UserDTO> users = userService.getPendingUsers();
        ApiResponse<List<UserDTO>> response = ApiResponse.<List<UserDTO>>builder()
                .success(true)
                .message("Pending users retrieved successfully")
                .data(users)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/users/{userId}/verify")
    public ResponseEntity<ApiResponse<UserDTO>> verifyUser(@PathVariable Long userId) {
        UserDTO user = userService.updateUserStatus(userId, "ACTIVE");
        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
                .success(true)
                .message("User verified successfully")
                .data(user)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/users/{userId}/reject")
    public ResponseEntity<ApiResponse<UserDTO>> rejectUser(@PathVariable Long userId) {
        UserDTO user = userService.updateUserStatus(userId, "SUSPENDED");
        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
                .success(true)
                .message("User rejected successfully")
                .data(user)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/users/{userId}/suspend")
    public ResponseEntity<ApiResponse<UserDTO>> suspendUser(@PathVariable Long userId) {
        UserDTO user = userService.updateUserStatus(userId, "SUSPENDED");
        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
                .success(true)
                .message("User suspended successfully")
                .data(user)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/users/{userId}/activate")
    public ResponseEntity<ApiResponse<UserDTO>> activateUser(@PathVariable Long userId) {
        UserDTO user = userService.updateUserStatus(userId, "ACTIVE");
        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
                .success(true)
                .message("User activated successfully")
                .data(user)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Farmer Verification Endpoints
    @GetMapping("/farmers/pending")
    public ResponseEntity<ApiResponse<List<FarmerDTO>>> getPendingFarmers() {
        List<FarmerDTO> farmers = farmerService.getAllPendingFarmers();
        ApiResponse<List<FarmerDTO>> response = ApiResponse.<List<FarmerDTO>>builder()
                .success(true)
                .message("Pending farmers retrieved successfully")
                .data(farmers)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/farmers/status/{status}")
    public ResponseEntity<ApiResponse<List<FarmerDTO>>> getFarmersByStatus(@PathVariable String status) {
        try {
            FarmerVerificationStatus verificationStatus = FarmerVerificationStatus.valueOf(status.toUpperCase());
            List<FarmerDTO> farmers = farmerService.getFarmersByVerificationStatus(verificationStatus);
            ApiResponse<List<FarmerDTO>> response = ApiResponse.<List<FarmerDTO>>builder()
                    .success(true)
                    .message("Farmers retrieved successfully")
                    .data(farmers)
                    .statusCode(HttpStatus.OK.value())
                    .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ApiResponse<List<FarmerDTO>> response = ApiResponse.<List<FarmerDTO>>builder()
                    .success(false)
                    .message("Invalid farmer verification status: " + status)
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .build();
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/farmers/{farmerId}/verify")
    public ResponseEntity<ApiResponse<FarmerDTO>> verifyFarmer(
            @PathVariable Long farmerId,
            @RequestBody(required = false) FarmerVerificationRequest request) {
        Long adminId = SecurityUtils.getCurrentUserId();
        FarmerDTO farmer = farmerService.verifyFarmer(farmerId, adminId, null);
        ApiResponse<FarmerDTO> response = ApiResponse.<FarmerDTO>builder()
                .success(true)
                .message("Farmer verified successfully")
                .data(farmer)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/farmers/{farmerId}/reject")
    public ResponseEntity<ApiResponse<FarmerDTO>> rejectFarmer(
            @PathVariable Long farmerId,
            @Valid @RequestBody FarmerVerificationRequest request) {
        Long adminId = SecurityUtils.getCurrentUserId();
        FarmerDTO farmer = farmerService.rejectFarmer(farmerId, adminId, request.getRejectionReason());
        ApiResponse<FarmerDTO> response = ApiResponse.<FarmerDTO>builder()
                .success(true)
                .message("Farmer rejected successfully")
                .data(farmer)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/farmers/{farmerId}")
    public ResponseEntity<ApiResponse<FarmerDTO>> getFarmerDetails(@PathVariable Long farmerId) {
        FarmerDTO farmer = farmerService.getFarmerById(farmerId);
        ApiResponse<FarmerDTO> response = ApiResponse.<FarmerDTO>builder()
                .success(true)
                .message("Farmer details retrieved successfully")
                .data(farmer)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/farmers/{farmerId}")
    public ResponseEntity<ApiResponse<String>> deleteFarmer(@PathVariable Long farmerId) {
        farmerService.deleteFarmerProfile(farmerId);
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("Farmer deleted successfully")
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Statistics Endpoints
    @GetMapping("/stats/farmers")
    public ResponseEntity<ApiResponse<Integer>> getTotalFarmersCount() {
        List<UserDTO> farmers = userService.getAllFarmers();
        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                .success(true)
                .message("Total farmers count retrieved successfully")
                .data(farmers.size())
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/stats/users")
    public ResponseEntity<ApiResponse<Integer>> getTotalUsersCount() {
        List<UserDTO> users = userService.getAllUsers();
        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                .success(true)
                .message("Total users count retrieved successfully")
                .data(users.size())
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAllPlatformOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        ApiResponse<List<OrderDTO>> response = ApiResponse.<List<OrderDTO>>builder()
                .success(true)
                .message("All platform transactions retrieved successfully")
                .data(orders)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * POST /admin/orders/{orderId}/assign-distributor
     * Assign an order to a distributor
     */
    @PostMapping("/orders/{orderId}/assign-distributor")
    public ResponseEntity<ApiResponse<OrderDTO>> assignOrderToDistributor(
            @PathVariable Long orderId,
            @RequestParam Long distributorId
    ) {
        OrderDTO order = orderService.assignToDistributor(orderId, distributorId);
        ApiResponse<OrderDTO> response = ApiResponse.<OrderDTO>builder()
                .success(true)
                .message("Order assigned to distributor successfully")
                .data(order)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
