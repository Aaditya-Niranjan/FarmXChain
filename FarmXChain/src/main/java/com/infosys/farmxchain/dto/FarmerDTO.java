package com.infosys.farmxchain.dto;

import com.infosys.farmxchain.entity.FarmerVerificationStatus;
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
public class FarmerDTO {
    private Long id;
    private UserDTO user;
    private String farmName;
    private String farmLocation;
    private Double latitude;
    private Double longitude;
    private BigDecimal farmSizeAcres;
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
    private FarmerVerificationStatus verificationStatus;
    private LocalDateTime verifiedAt;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BigDecimal totalProduceKg;
    private Integer experienceYears;
    private String certification;
}
