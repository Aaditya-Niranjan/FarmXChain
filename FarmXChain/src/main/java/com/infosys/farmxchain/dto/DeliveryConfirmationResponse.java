package com.infosys.farmxchain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryConfirmationResponse {
    private Long orderId;
    private Long shipmentId;
    private String custodyHash;
    private String blockchainTxHash;
    private String message;
}
