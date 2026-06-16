package com.infosys.farmxchain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "crops")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Crop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(name = "crop_name", nullable = false)
    private String cropName;

    @Column(name = "quantity_kg", nullable = false)
    private BigDecimal quantityKg;

    @Column(name = "price_per_kg")
    private BigDecimal pricePerKg;

    @Column(name = "harvest_date", nullable = false)
    private LocalDateTime harvestDate;

    @Column(name = "quality_certificate_url")
    private String qualityCertificateUrl;

    @Column(name = "blockchain_hash", unique = true)
    private String blockchainHash;

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash;

    @Column(name = "origin_location")
    private String originLocation;

    @Column(name = "quality_data")
    private String qualityData;

    @Column(name = "soil_type")
    private String soilType;

    @Column(name = "pesticides_used")
    private String pesticidesUsed;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
