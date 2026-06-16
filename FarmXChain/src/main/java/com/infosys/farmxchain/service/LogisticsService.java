package com.infosys.farmxchain.service;

import com.infosys.farmxchain.dto.ShipmentDTO;
import com.infosys.farmxchain.entity.Order;
import com.infosys.farmxchain.entity.OrderStatus;
import com.infosys.farmxchain.entity.Shipment;
import com.infosys.farmxchain.entity.ShipmentAction;
import com.infosys.farmxchain.entity.ShipmentStatus;
import com.infosys.farmxchain.exception.ResourceNotFoundException;
import com.infosys.farmxchain.repository.OrderRepository;
import com.infosys.farmxchain.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LogisticsService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private ShipmentLogService shipmentLogService;

    public ShipmentDTO createShipment(Long orderId, Long farmerUserId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getFarmer().getUser().getId().equals(farmerUserId)) {
            throw new RuntimeException("Unauthorized: Only the farmer who owns this order can start a shipment.");
        }

        if (order.getStatus() != OrderStatus.ACCEPTED) {
            throw new RuntimeException("Order must be accepted before shipping");
        }

        Shipment shipment = Shipment.builder()
                .order(order)
                .status(ShipmentStatus.IN_TRANSIT)
                .currentLocation(order.getFarmer().getFarmLocation())
                .build();

        Shipment savedShipment = shipmentRepository.save(shipment);

        // Blockchain logging for initial pickup
        String txHash = null;
        try {
            txHash = blockchainService.logShipment(order.getId(), order.getFarmer().getFarmLocation(), "Shipment PICKED UP from farm");
            savedShipment.setBlockchainTxHash(txHash);
            shipmentRepository.save(savedShipment);
        } catch (Exception e) {
            System.err.println("Blockchain logging error: " + e.getMessage());
        }

        // Create initial log
        shipmentLogService.createLog(
            savedShipment.getId(),
            ShipmentAction.PICKED_UP,
            order.getFarmer().getFarmLocation(),
            "Shipment organized and tracking started by farmer",
            txHash
        );

        return convertToDTO(savedShipment);
    }

    public ShipmentDTO updateShipment(Long shipmentId, String location, Double temperature, Double humidity, ShipmentStatus status) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + shipmentId));

        shipment.setCurrentLocation(location);
        shipment.setTemperature(temperature);
        shipment.setHumidity(humidity);
        shipment.setStatus(status);

        if (status == ShipmentStatus.DELIVERED) {
            shipment.getOrder().setStatus(OrderStatus.DELIVERED);
            orderRepository.save(shipment.getOrder());
        }

        // Blockchain logging
        String conditionData = "Temp: " + temperature + ", Hum: " + humidity;
        String txHash = blockchainService.logShipment(shipment.getOrder().getId(), location, conditionData);
        shipment.setBlockchainTxHash(txHash);

        // Create status update log
        shipmentLogService.createLog(
            shipmentId,
            status == ShipmentStatus.DELIVERED ? ShipmentAction.DELIVERED : ShipmentAction.STATUS_UPDATE,
            location,
            "Farmer updated sensor data and status to " + status,
            txHash
        );

        return convertToDTO(shipmentRepository.save(shipment));
    }

    public ShipmentDTO getShipmentByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        Shipment shipment = shipmentRepository.findByOrder(order)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment tracking not found for order id: " + orderId));
        
        return convertToDTO(shipment);
    }

    private ShipmentDTO convertToDTO(Shipment shipment) {
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
                .logs(shipmentLogService.getLogsByShipment(shipment.getId()))
                .build();
    }
}
