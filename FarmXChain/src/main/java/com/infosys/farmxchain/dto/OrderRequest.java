package com.infosys.farmxchain.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderRequest {
    private Long cropId;
    private BigDecimal quantity;
    private String deliveryAddress; // Buyer's delivery address
}
