package com.infosys.farmxchain.repository;

import com.infosys.farmxchain.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

    List<Crop> findByFarmerId(Long farmerId);

    @Query("SELECT c FROM Crop c WHERE c.farmer.id = :farmerId AND c.cropName = :cropName")
    List<Crop> findByFarmerIdAndCropName(@Param("farmerId") Long farmerId, @Param("cropName") String cropName);

    @Query("SELECT c FROM Crop c WHERE c.blockchainHash IS NOT NULL")
    List<Crop> findAllWithBlockchainHash();

    @Query("SELECT c FROM Crop c WHERE c.farmer.id = :farmerId AND c.blockchainHash IS NOT NULL")
    List<Crop> findByFarmerIdWithBlockchainHash(@Param("farmerId") Long farmerId);
}
