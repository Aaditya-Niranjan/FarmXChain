package com.infosys.farmxchain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerProfileRequest {
    @NotBlank(message = "Farm name is required")
    private String farmName;

    @NotBlank(message = "Farm location is required")
    private String farmLocation;

    private Double latitude;
    private Double longitude;

    private BigDecimal farmSizeAcres;

    @NotBlank(message = "Crop type is required")
    private String cropType;

    private String cropVarieties;
    private String farmingMethod;
    private String licenseNumber;
    private String aadharNumber;

    private String bankAccountHolder;
    private String bankAccountNumber;
    private String bankIfscCode;
    private String bankName;
    private String upiId;

    private Integer experienceYears;
    private String certification;
}
