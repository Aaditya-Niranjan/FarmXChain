package com.infosys.farmxchain.service;

import com.infosys.farmxchain.dto.*;
import com.infosys.farmxchain.entity.*;
import com.infosys.farmxchain.exception.ResourceNotFoundException;
import com.infosys.farmxchain.repository.OrderRepository;
import com.infosys.farmxchain.repository.ShipmentRepository;
import com.infosys.farmxchain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DistributorService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShipmentLogService shipmentLogService;

    @Autowired
    private BlockchainService blockchainService;

    /**
     * Get all orders assigned to a distributor
     */
    public List<OrderDTO> getAssignedOrders(Long distributorId) {
        User distributor = userRepository.findById(distributorId)
                .orElseThrow(() -> new ResourceNotFoundException("Distributor not found with id: " + distributorId));

        if (distributor.getRole() != Role.DISTRIBUTOR) {
            throw new RuntimeException("User is not a distributor");
        }

        return orderRepository.findByDistributor(distributor).stream()
                .map(this::convertOrderToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get orders assigned to distributor filtered by status
     */
    public List<OrderDTO> getAssignedOrdersByStatus(Long distributorId, OrderStatus status) {
        User distributor = userRepository.findById(distributorId)
                .orElseThrow(() -> new ResourceNotFoundException("Distributor not found with id: " + distributorId));

        if (distributor.getRole() != Role.DISTRIBUTOR) {
            throw new RuntimeException("User is not a distributor");
        }

        return orderRepository.findByDistributorAndStatus(distributor, status).stream()
                .map(this::convertOrderToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a shipment for an assigned order
     */
    public ShipmentDTO createShipment(Long distributorId, ShipmentRequest request) {
        User distributor = userRepository.findById(distributorId)
                .orElseThrow(() -> new ResourceNotFoundException("Distributor not found with id: " + distributorId));

        if (distributor.getRole() != Role.DISTRIBUTOR) {
            throw new RuntimeException("User is not a distributor");
        }

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        // Verify distributor owns this order
        if (order.getDistributor() == null || !order.getDistributor().getId().equals(distributorId)) {
            throw new RuntimeException("Unauthorized: This order is not assigned to you");
        }

        // Verify order is in ASSIGNED status
        if (order.getStatus() != OrderStatus.ASSIGNED) {
            throw new RuntimeException("Order must be in ASSIGNED status to create shipment. Current status: " + order.getStatus());
        }

        // Create shipment
        Shipment shipment = Shipment.builder()
                .order(order)
                .distributor(distributor)
                .origin(request.getOrigin())
                .destination(request.getDestination())
                .transportMode(request.getTransportMode())
                .currentLocation(request.getOrigin())
                .status(ShipmentStatus.PICKED_UP)
                .logs(new ArrayList<>())
                .build();

        Shipment savedShipment = shipmentRepository.save(shipment);

        // Update order status to IN_TRANSIT
        order.setStatus(OrderStatus.IN_TRANSIT);
        orderRepository.save(order);

        // Create initial log entry
        String txHash = null;
        try {
            txHash = blockchainService.logShipment(order.getId(), request.getOrigin(), "Shipment PICKED UP from origin");
            savedShipment.setBlockchainTxHash(txHash);
            shipmentRepository.save(savedShipment);
        } catch (Exception e) {
            System.err.println("Blockchain logging error: " + e.getMessage());
        }

        shipmentLogService.createLog(
                savedShipment.getId(),
                ShipmentAction.PICKED_UP,
                request.getOrigin(),
                "Shipment picked up from origin",
                txHash
        );

        return convertShipmentToDTO(savedShipment);
    }

    /**
     * Update shipment status during transit
     */
    public ShipmentDTO updateShipmentStatus(Long distributorId, Long shipmentId, ShipmentStatusUpdateRequest request) {
        User distributor = userRepository.findById(distributorId)
                .orElseThrow(() -> new ResourceNotFoundException("Distributor not found with id: " + distributorId));

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + shipmentId));

        // Verify distributor owns this shipment
        if (shipment.getDistributor() == null || !shipment.getDistributor().getId().equals(distributorId)) {
            throw new RuntimeException("Unauthorized: This shipment is not assigned to you");
        }

        // Update shipment details
        if (request.getCurrentLocation() != null) {
            shipment.setCurrentLocation(request.getCurrentLocation());
        }
        if (request.getTemperature() != null) {
            shipment.setTemperature(request.getTemperature());
        }
        if (request.getHumidity() != null) {
            shipment.setHumidity(request.getHumidity());
        }
        if (request.getStatus() != null) {
            shipment.setStatus(request.getStatus());

            // If status is DELIVERED, we should use the confirmDelivery method instead
            if (request.getStatus() == ShipmentStatus.DELIVERED) {
                throw new RuntimeException("Please use the delivery confirmation endpoint to mark shipment as delivered");
            }
        }

        Shipment updatedShipment = shipmentRepository.save(shipment);

        // Create log entry
        ShipmentAction logAction = ShipmentAction.STATUS_UPDATE;
        if (request.getCurrentLocation() != null) {
            logAction = ShipmentAction.LOCATION_UPDATE;
        }

        // Log to blockchain if needed
        String txHash = null;
        try {
            String conditionData = "Temp: " + shipment.getTemperature() + ", Hum: " + shipment.getHumidity();
            txHash = blockchainService.logShipment(
                    shipment.getOrder().getId(),
                    shipment.getCurrentLocation(),
                    conditionData
            );
            updatedShipment.setBlockchainTxHash(txHash);
            shipmentRepository.save(updatedShipment);
        } catch (Exception e) {
            System.err.println("Non-critical blockchain logging error: " + e.getMessage());
        }

        shipmentLogService.createLog(
                shipmentId,
                logAction,
                request.getCurrentLocation(),
                request.getNotes() != null ? request.getNotes() : "Shipment status updated",
                txHash
        );

        return convertShipmentToDTO(updatedShipment);
    }

    /**
     * Confirm delivery to buyer
     */
    public DeliveryConfirmationResponse confirmDelivery(Long distributorId, DeliveryConfirmationRequest request) {
        User distributor = userRepository.findById(distributorId)
                .orElseThrow(() -> new ResourceNotFoundException("Distributor not found with id: " + distributorId));

        Shipment shipment = shipmentRepository.findById(request.getShipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + request.getShipmentId()));

        // Verify distributor owns this shipment
        if (shipment.getDistributor() == null || !shipment.getDistributor().getId().equals(distributorId)) {
            throw new RuntimeException("Unauthorized: This shipment is not assigned to you");
        }

        // Verify shipment is in transit
        if (shipment.getStatus() == ShipmentStatus.DELIVERED) {
            throw new RuntimeException("Shipment is already marked as delivered");
        }

        Order order = shipment.getOrder();

        // Generate custody transfer hash
        String custodyHash = generateCustodyHash(order.getId(), shipment.getId());
        shipment.setCustodyHash(custodyHash);

        // Update shipment status
        shipment.setStatus(ShipmentStatus.DELIVERED);
        shipmentRepository.save(shipment);

        // Update order status
        order.setStatus(OrderStatus.DELIVERED);
        
        // Pay distributor - 7% of order total as delivery fee
        if (order.getTotalPrice() != null) {
            java.math.BigDecimal deliveryFee = order.getTotalPrice().multiply(new java.math.BigDecimal("0.07"));
            order.setDeliveryFee(deliveryFee);
            
            // Credit distributor's wallet
            distributor.setBalance(distributor.getBalance().add(deliveryFee));
            userRepository.save(distributor);
            
            System.out.println("Distributor " + distributor.getName() + " earned ₹" + deliveryFee + " for delivery of order #" + order.getId());
        }
        
        orderRepository.save(order);

        // Log to blockchain
        String blockchainTxHash = null;
        try {
            blockchainTxHash = blockchainService.logShipment(
                    order.getId(),
                    shipment.getDestination(),
                    "DELIVERED - Custody Hash: " + custodyHash
            );
            shipment.setBlockchainTxHash(blockchainTxHash);
            shipmentRepository.save(shipment);
        } catch (Exception e) {
            System.err.println("Non-critical blockchain logging error: " + e.getMessage());
        }

        // Create delivery log
        shipmentLogService.createLog(
                shipment.getId(),
                ShipmentAction.DELIVERED,
                shipment.getDestination(),
                request.getDeliveryNotes() != null ? request.getDeliveryNotes() : "Delivered to buyer",
                blockchainTxHash
        );

        return DeliveryConfirmationResponse.builder()
                .orderId(order.getId())
                .shipmentId(shipment.getId())
                .custodyHash(custodyHash)
                .blockchainTxHash(blockchainTxHash)
                .message("Delivery confirmed successfully")
                .build();
    }

    /**
     * Generate immutable custody transfer hash
     */
    private String generateCustodyHash(Long orderId, Long shipmentId) {
        try {
            String data = orderId + "-" + shipmentId + "-" + LocalDateTime.now().toString();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return "CUSTODY-" + hexString.toString().substring(0, 16).toUpperCase();
        } catch (Exception e) {
            // Fallback to simple hash
            return "CUSTODY-" + orderId + "-" + shipmentId + "-" + System.currentTimeMillis();
        }
    }

    private OrderDTO convertOrderToDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .buyerId(order.getBuyer().getId())
                .buyerName(order.getBuyer().getName())
                .farmerId(order.getFarmer().getId())
                .farmName(order.getFarmer().getFarmName())
                .cropId(order.getCrop().getId())
                .cropName(order.getCrop().getCropName())
                .quantity(order.getQuantity())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .buyerRole(order.getBuyer().getRole().name())
                .distributorId(order.getDistributor() != null ? order.getDistributor().getId() : null)
                .distributorName(order.getDistributor() != null ? order.getDistributor().getName() : null)
                .blockchainTxHash(order.getBlockchainTxHash())
                .createdAt(order.getCreatedAt())
                .deliveryAddress(order.getDeliveryAddress())
                .build();
    }

    private ShipmentDTO convertShipmentToDTO(Shipment shipment) {
        List<ShipmentLogDTO> logs = shipmentLogService.getLogsByShipment(shipment.getId());

        return ShipmentDTO.builder()
                .id(shipment.getId())
                .orderId(shipment.getOrder().getId())
                .distributorId(shipment.getDistributor() != null ? shipment.getDistributor().getId() : null)
                .distributorName(shipment.getDistributor() != null ? shipment.getDistributor().getName() : null)
                .origin(shipment.getOrigin())
                .destination(shipment.getDestination())
                .transportMode(shipment.getTransportMode())
                .currentLocation(shipment.getCurrentLocation())
                .temperature(shipment.getTemperature())
                .humidity(shipment.getHumidity())
                .status(shipment.getStatus())
                .lastUpdated(shipment.getLastUpdated())
                .blockchainTxHash(shipment.getBlockchainTxHash())
                .custodyHash(shipment.getCustodyHash())
                .logs(logs)
                .build();
    }
}
