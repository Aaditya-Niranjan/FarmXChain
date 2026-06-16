package com.infosys.farmxchain.controller;

import com.infosys.farmxchain.dto.*;
import com.infosys.farmxchain.entity.OrderStatus;
import com.infosys.farmxchain.security.SecurityUtils;
import com.infosys.farmxchain.service.DistributorService;
import com.infosys.farmxchain.service.ShipmentLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/distributor")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DistributorController {

    @Autowired
    private DistributorService distributorService;

    @Autowired
    private ShipmentLogService shipmentLogService;

    /**
     * GET /distributor/orders
     * Get all orders assigned to the current distributor
     */
    @GetMapping("/orders")
    @PreAuthorize("hasRole('DISTRIBUTOR')")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAssignedOrders(
            @RequestParam(required = false) OrderStatus status
    ) {
        Long distributorId = SecurityUtils.getCurrentUserId();
        List<OrderDTO> orders;

        if (status != null) {
            orders = distributorService.getAssignedOrdersByStatus(distributorId, status);
        } else {
            orders = distributorService.getAssignedOrders(distributorId);
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Orders retrieved successfully", orders));
    }

    /**
     * POST /distributor/shipments
     * Create a new shipment for an assigned order
     */
    @PostMapping("/shipments")
    @PreAuthorize("hasRole('DISTRIBUTOR')")
    public ResponseEntity<ApiResponse<ShipmentDTO>> createShipment(@RequestBody ShipmentRequest request) {
        Long distributorId = SecurityUtils.getCurrentUserId();
        ShipmentDTO shipment = distributorService.createShipment(distributorId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Shipment created successfully", shipment));
    }

    /**
     * PUT /distributor/shipments/{shipmentId}/status
     * Update shipment status during transit
     */
    @PutMapping("/shipments/{shipmentId}/status")
    @PreAuthorize("hasRole('DISTRIBUTOR')")
    public ResponseEntity<ApiResponse<ShipmentDTO>> updateShipmentStatus(
            @PathVariable Long shipmentId,
            @RequestBody ShipmentStatusUpdateRequest request
    ) {
        Long distributorId = SecurityUtils.getCurrentUserId();
        ShipmentDTO shipment = distributorService.updateShipmentStatus(distributorId, shipmentId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Shipment status updated successfully", shipment));
    }

    /**
     * POST /distributor/shipments/deliver
     * Confirm delivery to buyer
     */
    @PostMapping("/shipments/deliver")
    @PreAuthorize("hasRole('DISTRIBUTOR')")
    public ResponseEntity<ApiResponse<DeliveryConfirmationResponse>> confirmDelivery(
            @RequestBody DeliveryConfirmationRequest request
    ) {
        Long distributorId = SecurityUtils.getCurrentUserId();
        DeliveryConfirmationResponse response = distributorService.confirmDelivery(distributorId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Delivery confirmed successfully", response));
    }

    /**
     * GET /distributor/shipments/{shipmentId}/logs
     * Get all logs for a specific shipment
     */
    @GetMapping("/shipments/{shipmentId}/logs")
    @PreAuthorize("hasRole('DISTRIBUTOR')")
    public ResponseEntity<ApiResponse<List<ShipmentLogDTO>>> getShipmentLogs(@PathVariable Long shipmentId) {
        List<ShipmentLogDTO> logs = shipmentLogService.getLogsByShipment(shipmentId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Shipment logs retrieved successfully", logs));
    }
}
