package com.infosys.farmxchain.dto;

import com.infosys.farmxchain.entity.OrderStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class OrderDTO {
    private Long id;
    private Long buyerId;
    private String buyerName;
    private Long farmerId;
    private String farmName;
    private Long cropId;
    private String cropName;
    private BigDecimal quantity;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private String buyerRole;
    private Long distributorId;
    private String distributorName;
    private String blockchainTxHash;
    private LocalDateTime createdAt;
    private String deliveryAddress; // Buyer's delivery address
}
