package com.infosys.farmxchain.dto;

import com.infosys.farmxchain.entity.ShipmentStatus;
import lombok.Data;

@Data
public class ShipmentUpdateRequest {
    private String location;
    private Double temperature;
    private Double humidity;
    private ShipmentStatus status;
}
