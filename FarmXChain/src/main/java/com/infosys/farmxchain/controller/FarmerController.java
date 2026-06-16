package com.infosys.farmxchain.controller;

import com.infosys.farmxchain.dto.ApiResponse;
import com.infosys.farmxchain.dto.FarmerDTO;
import com.infosys.farmxchain.dto.FarmerProfileRequest;
import com.infosys.farmxchain.dto.OrderDTO;
import com.infosys.farmxchain.dto.UserDTO;
import com.infosys.farmxchain.security.SecurityUtils;
import com.infosys.farmxchain.service.FarmerService;
import com.infosys.farmxchain.service.OrderService;
import com.infosys.farmxchain.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/farmers")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<FarmerDTO>> createFarmerProfile(
            @Valid @RequestBody FarmerProfileRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        FarmerDTO farmer = farmerService.createFarmerProfile(userId, request);
        ApiResponse<FarmerDTO> response = ApiResponse.<FarmerDTO>builder()
                .success(true)
                .message("Farmer profile created successfully. Awaiting admin verification.")
                .data(farmer)
                .statusCode(HttpStatus.CREATED.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<FarmerDTO>> updateFarmerProfile(
            @Valid @RequestBody FarmerProfileRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        FarmerDTO farmer = farmerService.updateFarmerProfile(userId, request);
        ApiResponse<FarmerDTO> response = ApiResponse.<FarmerDTO>builder()
                .success(true)
                .message("Farmer profile updated successfully")
                .data(farmer)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<FarmerDTO>> getFarmerProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        FarmerDTO farmer = farmerService.getFarmerProfile(userId);
        ApiResponse<FarmerDTO> response = ApiResponse.<FarmerDTO>builder()
                .success(true)
                .message("Farmer profile retrieved successfully")
                .data(farmer)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{farmerId}")
    public ResponseEntity<ApiResponse<FarmerDTO>> getFarmerById(@PathVariable Long farmerId) {
        FarmerDTO farmer = farmerService.getFarmerById(farmerId);
        ApiResponse<FarmerDTO> response = ApiResponse.<FarmerDTO>builder()
                .success(true)
                .message("Farmer retrieved successfully")
                .data(farmer)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/crop/{cropType}")
    public ResponseEntity<ApiResponse<List<FarmerDTO>>> getFarmersByCropType(
            @PathVariable String cropType) {
        List<FarmerDTO> farmers = farmerService.getFarmersByCropType(cropType);
        ApiResponse<List<FarmerDTO>> response = ApiResponse.<List<FarmerDTO>>builder()
                .success(true)
                .message("Farmers retrieved successfully")
                .data(farmers)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<FarmerDTO>>> getAllFarmers() {
        List<FarmerDTO> farmers = farmerService.getAllFarmers();
        ApiResponse<List<FarmerDTO>> response = ApiResponse.<List<FarmerDTO>>builder()
                .success(true)
                .message("All farmers retrieved successfully")
                .data(farmers)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{farmerId}")
    public ResponseEntity<ApiResponse<String>> deleteFarmerProfile(@PathVariable Long farmerId) {
        farmerService.deleteFarmerProfile(farmerId);
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("Farmer profile deleted successfully")
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * GET /farmers/distributors
     * Get list of all available distributors
     */
    @GetMapping("/distributors")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getDistributors() {
        List<UserDTO> distributors = userService.getUsersByRole("DISTRIBUTOR");
        ApiResponse<List<UserDTO>> response = ApiResponse.<List<UserDTO>>builder()
                .success(true)
                .message("Distributors retrieved successfully")
                .data(distributors)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * POST /farmers/orders/{orderId}/assign-distributor
     * Assign a distributor to a farmer's accepted order
     */
    @PostMapping("/orders/{orderId}/assign-distributor")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<OrderDTO>> assignDistributorToOrder(
            @PathVariable Long orderId,
            @RequestParam Long distributorId) {
        
        // Verify the order belongs to this farmer
        Long farmerId = SecurityUtils.getCurrentUserId();
        OrderDTO order = orderService.assignToDistributor(orderId, distributorId);
        
        ApiResponse<OrderDTO> response = ApiResponse.<OrderDTO>builder()
                .success(true)
                .message("Distributor assigned successfully. Order status changed to ASSIGNED.")
                .data(order)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
