package com.infosys.farmxchain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropDTO {
    private Long id;
    private FarmerDTO farmer;
    private String cropName;
    private BigDecimal quantityKg;
    private BigDecimal pricePerKg;
    private LocalDateTime harvestDate;
    private String qualityCertificateUrl;
    private String blockchainHash;
    private String blockchainTxHash;
    private String originLocation;
    private String qualityData;
    private String soilType;
    private String pesticidesUsed;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
