package com.infosys.farmxchain.service;

import com.infosys.farmxchain.dto.FarmerDTO;
import com.infosys.farmxchain.dto.FarmerProfileRequest;
import com.infosys.farmxchain.entity.Farmer;
import com.infosys.farmxchain.entity.FarmerVerificationStatus;
import com.infosys.farmxchain.entity.User;
import com.infosys.farmxchain.exception.ResourceNotFoundException;
import com.infosys.farmxchain.repository.FarmerRepository;
import com.infosys.farmxchain.repository.UserRepository;
import static com.infosys.farmxchain.service.AuthService.convertUserToDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FarmerService {

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private UserRepository userRepository;

    public FarmerDTO createFarmerProfile(Long userId, FarmerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (farmerRepository.existsByUserId(userId)) {
            throw new RuntimeException("Farmer profile already exists for this user");
        }

        Farmer farmer = Farmer.builder()
                .user(user)
                .farmName(request.getFarmName())
                .farmLocation(request.getFarmLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .farmSizeAcres(request.getFarmSizeAcres())
                .cropType(request.getCropType())
                .cropVarieties(request.getCropVarieties())
                .farmingMethod(request.getFarmingMethod())
                .licenseNumber(request.getLicenseNumber())
                .aadharNumber(request.getAadharNumber())
                .bankAccountHolder(request.getBankAccountHolder())
                .bankAccountNumber(request.getBankAccountNumber())
                .bankIfscCode(request.getBankIfscCode())
                .bankName(request.getBankName())
                .upiId(request.getUpiId())
                .experienceYears(request.getExperienceYears())
                .certification(request.getCertification())
                .verificationStatus(FarmerVerificationStatus.PENDING)
                .build();

        Farmer savedFarmer = farmerRepository.save(farmer);
        return convertToDTO(savedFarmer);
    }

    public FarmerDTO updateFarmerProfile(Long userId, FarmerProfileRequest request) {
        Farmer farmer = farmerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for user: " + userId));

        farmer.setFarmName(request.getFarmName());
        farmer.setFarmLocation(request.getFarmLocation());
        farmer.setLatitude(request.getLatitude());
        farmer.setLongitude(request.getLongitude());
        farmer.setFarmSizeAcres(request.getFarmSizeAcres());
        farmer.setCropType(request.getCropType());
        farmer.setCropVarieties(request.getCropVarieties());
        farmer.setFarmingMethod(request.getFarmingMethod());
        farmer.setLicenseNumber(request.getLicenseNumber());
        farmer.setAadharNumber(request.getAadharNumber());
        farmer.setBankAccountHolder(request.getBankAccountHolder());
        farmer.setBankAccountNumber(request.getBankAccountNumber());
        farmer.setBankIfscCode(request.getBankIfscCode());
        farmer.setBankName(request.getBankName());
        farmer.setUpiId(request.getUpiId());
        farmer.setExperienceYears(request.getExperienceYears());
        farmer.setCertification(request.getCertification());

        Farmer updatedFarmer = farmerRepository.save(farmer);
        return convertToDTO(updatedFarmer);
    }

    public FarmerDTO getFarmerProfile(Long userId) {
        Farmer farmer = farmerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for user: " + userId));
        return convertToDTO(farmer);
    }

    public FarmerDTO getFarmerById(Long farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found with id: " + farmerId));
        return convertToDTO(farmer);
    }

    public List<FarmerDTO> getAllPendingFarmers() {
        return farmerRepository.findByVerificationStatus(FarmerVerificationStatus.PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FarmerDTO> getFarmersByVerificationStatus(FarmerVerificationStatus status) {
        return farmerRepository.findByVerificationStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FarmerDTO> getFarmersByCropType(String cropType) {
        return farmerRepository.findByCropType(cropType)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FarmerDTO> getAllFarmers() {
        return farmerRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FarmerDTO verifyFarmer(Long farmerId, Long adminId, String rejectionReason) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found with id: " + farmerId));

        farmer.setVerificationStatus(FarmerVerificationStatus.VERIFIED);
        farmer.setVerifiedBy(adminId);
        farmer.setVerifiedAt(LocalDateTime.now());
        farmer.setRejectionReason(null);

        Farmer updatedFarmer = farmerRepository.save(farmer);
        return convertToDTO(updatedFarmer);
    }

    public FarmerDTO rejectFarmer(Long farmerId, Long adminId, String rejectionReason) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found with id: " + farmerId));

        farmer.setVerificationStatus(FarmerVerificationStatus.REJECTED);
        farmer.setVerifiedBy(adminId);
        farmer.setVerifiedAt(LocalDateTime.now());
        farmer.setRejectionReason(rejectionReason);

        Farmer updatedFarmer = farmerRepository.save(farmer);
        return convertToDTO(updatedFarmer);
    }

    public void deleteFarmerProfile(Long farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found with id: " + farmerId));
        farmerRepository.delete(farmer);
    }

    private FarmerDTO convertToDTO(Farmer farmer) {
        return FarmerDTO.builder()
                .id(farmer.getId())
                .user(convertUserToDTO(farmer.getUser()))
                .farmName(farmer.getFarmName())
                .farmLocation(farmer.getFarmLocation())
                .latitude(farmer.getLatitude())
                .longitude(farmer.getLongitude())
                .farmSizeAcres(farmer.getFarmSizeAcres())
                .cropType(farmer.getCropType())
                .cropVarieties(farmer.getCropVarieties())
                .farmingMethod(farmer.getFarmingMethod())
                .licenseNumber(farmer.getLicenseNumber())
                .aadharNumber(farmer.getAadharNumber())
                .bankAccountHolder(farmer.getBankAccountHolder())
                .bankAccountNumber(farmer.getBankAccountNumber())
                .bankIfscCode(farmer.getBankIfscCode())
                .bankName(farmer.getBankName())
                .upiId(farmer.getUpiId())
                .verificationStatus(farmer.getVerificationStatus())
                .verifiedAt(farmer.getVerifiedAt())
                .rejectionReason(farmer.getRejectionReason())
                .createdAt(farmer.getCreatedAt())
                .updatedAt(farmer.getUpdatedAt())
                .totalProduceKg(farmer.getTotalProduceKg())
                .experienceYears(farmer.getExperienceYears())
                .certification(farmer.getCertification())
                .build();
    }
}
