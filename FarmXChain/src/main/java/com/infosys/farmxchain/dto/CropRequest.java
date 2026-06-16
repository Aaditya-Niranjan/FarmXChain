package com.infosys.farmxchain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class CropRequest {
    @NotBlank(message = "Crop name is required")
    private String cropName;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantityKg;

    @Positive(message = "Price per kg must be positive")
    private BigDecimal pricePerKg;

    @NotNull(message = "Harvest date is required")
    private LocalDateTime harvestDate;

    private String qualityCertificateUrl;
    private String originLocation;
    private String qualityData;
    private String soilType;
    private String pesticidesUsed;
    private String imageUrl;
}
