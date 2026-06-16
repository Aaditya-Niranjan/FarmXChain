package com.infosys.farmxchain.repository;

import com.infosys.farmxchain.entity.Farmer;
import com.infosys.farmxchain.entity.FarmerVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {
    Optional<Farmer> findByUserId(Long userId);
    List<Farmer> findByVerificationStatus(FarmerVerificationStatus status);
    List<Farmer> findByCropType(String cropType);
    boolean existsByUserId(Long userId);
    Optional<Farmer> findByAadharNumber(String aadharNumber);
}
