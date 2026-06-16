package com.infosys.farmxchain.service;

import com.infosys.farmxchain.dto.ShipmentLogDTO;
import com.infosys.farmxchain.entity.Shipment;
import com.infosys.farmxchain.entity.ShipmentAction;
import com.infosys.farmxchain.entity.ShipmentLog;
import com.infosys.farmxchain.exception.ResourceNotFoundException;
import com.infosys.farmxchain.repository.ShipmentLogRepository;
import com.infosys.farmxchain.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShipmentLogService {

    @Autowired
    private ShipmentLogRepository shipmentLogRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    public ShipmentLogDTO createLog(Long shipmentId, ShipmentAction action, String location, String notes, String blockchainTxHash) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + shipmentId));

        ShipmentLog log = ShipmentLog.builder()
                .shipment(shipment)
                .action(action)
                .location(location)
                .notes(notes)
                .blockchainTxHash(blockchainTxHash)
                .build();

        ShipmentLog savedLog = shipmentLogRepository.save(log);
        return convertToDTO(savedLog);
    }

    public List<ShipmentLogDTO> getLogsByShipment(Long shipmentId) {
        return shipmentLogRepository.findByShipmentIdOrderByCreatedAtAsc(shipmentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ShipmentLogDTO convertToDTO(ShipmentLog log) {
        return ShipmentLogDTO.builder()
                .id(log.getId())
                .shipmentId(log.getShipment().getId())
                .action(log.getAction())
                .location(log.getLocation())
                .notes(log.getNotes())
                .createdAt(log.getCreatedAt())
                .blockchainTxHash(log.getBlockchainTxHash())
                .build();
    }
}
