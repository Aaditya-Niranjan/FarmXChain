package com.infosys.farmxchain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Farmer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "farm_name", nullable = false)
    private String farmName;

    @Column(name = "farm_location", nullable = false)
    private String farmLocation;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "farm_size_acres")
    private BigDecimal farmSizeAcres;

    @Column(name = "crop_type", nullable = false)
    private String cropType;

    @Column(name = "crop_varieties")
    private String cropVarieties;

    @Column(name = "farming_method")
    private String farmingMethod;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "aadhar_number")
    private String aadharNumber;

    @Column(name = "bank_account_holder")
    private String bankAccountHolder;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "bank_ifsc_code")
    private String bankIfscCode;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "upi_id")
    private String upiId;

    @Column(name = "verification_status")
    @Enumerated(EnumType.STRING)
    private FarmerVerificationStatus verificationStatus;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "total_produce_kg")
    private BigDecimal totalProduceKg;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "certification")
    private String certification;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (verificationStatus == null) {
            verificationStatus = FarmerVerificationStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
