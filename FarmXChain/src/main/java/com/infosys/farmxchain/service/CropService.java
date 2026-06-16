package com.infosys.farmxchain.service;

import com.infosys.farmxchain.dto.CropDTO;
import com.infosys.farmxchain.dto.CropRequest;
import com.infosys.farmxchain.dto.FarmerDTO;
import com.infosys.farmxchain.entity.Crop;
import com.infosys.farmxchain.entity.Farmer;
import com.infosys.farmxchain.exception.ResourceNotFoundException;
import com.infosys.farmxchain.repository.CropRepository;
import com.infosys.farmxchain.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CropService {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private BlockchainService blockchainService;

    public CropDTO addCrop(Long farmerId, CropRequest request) {
        Farmer farmer = farmerRepository.findByUserId(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found with id: " + farmerId));

        Crop crop = Crop.builder()
                .farmer(farmer)
                .cropName(request.getCropName())
                .quantityKg(request.getQuantityKg())
                .pricePerKg(request.getPricePerKg())
                .harvestDate(request.getHarvestDate())
                .qualityCertificateUrl(request.getQualityCertificateUrl())
                .originLocation(request.getOriginLocation() != null ? request.getOriginLocation() : farmer.getFarmLocation())
                .qualityData(request.getQualityData())
                .soilType(request.getSoilType())
                .pesticidesUsed(request.getPesticidesUsed())
                .imageUrl(request.getImageUrl())
                .build();
        
        Crop savedCrop = cropRepository.save(crop);

        // Register on blockchain
        // String cropData = savedCrop.getId() + ":" + savedCrop.getCropName() + ":" +
        //                  savedCrop.getQuantityKg() + ":" + savedCrop.getHarvestDate() + ":" +
        //                  savedCrop.getOriginLocation() + ":" + savedCrop.getQualityData();
        
        String cropDataString = savedCrop.getId() + ":" + savedCrop.getCropName() + ":" +
                         savedCrop.getQuantityKg() + ":" + savedCrop.getHarvestDate() + ":" +
                         savedCrop.getOriginLocation() + ":" + savedCrop.getQualityData();

        String blockchainTxHash = blockchainService.registerCropOnBlockchain(
            savedCrop.getId(),
            savedCrop.getCropName(),
            savedCrop.getQuantityKg(),
            savedCrop.getOriginLocation(),
            savedCrop.getHarvestDate(),
            savedCrop.getQualityData()
        );
        String blockchainHash = blockchainService.generateBlockchainHash(cropDataString);

        savedCrop.setBlockchainTxHash(blockchainTxHash);
        savedCrop.setBlockchainHash(blockchainHash);

        savedCrop = cropRepository.save(savedCrop);

        return convertToDTO(savedCrop);
    }

    public List<CropDTO> getCropsByFarmer(Long userId) {
        Farmer farmer = farmerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found with id: " + userId));
        return cropRepository.findByFarmerId(farmer.getId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CropDTO getCropById(Long cropId) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + cropId));
        return convertToDTO(crop);
    }

    public List<CropDTO> getAllCrops() {
        return cropRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CropDTO> getCropsWithBlockchainRecords() {
        return cropRepository.findAllWithBlockchainHash()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean verifyBlockchainRecord(Long cropId) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + cropId));

        if (crop.getBlockchainHash() == null) {
            return false;
        }

        // For simulation purposes, if the crop has a blockchain hash, consider it verified
        // In production, this would perform actual blockchain verification
        return true;
    }

    private CropDTO convertToDTO(Crop crop) {
        return CropDTO.builder()
                .id(crop.getId())
                .farmer(convertToDTO(crop.getFarmer()))
                .cropName(crop.getCropName())
                .quantityKg(crop.getQuantityKg())
                .pricePerKg(crop.getPricePerKg())
                .harvestDate(crop.getHarvestDate())
                .qualityCertificateUrl(crop.getQualityCertificateUrl())
                .blockchainHash(crop.getBlockchainHash())
                .blockchainTxHash(crop.getBlockchainTxHash())
                .originLocation(crop.getOriginLocation())
                .qualityData(crop.getQualityData())
                .soilType(crop.getSoilType())
                .pesticidesUsed(crop.getPesticidesUsed())
                .imageUrl(crop.getImageUrl())
                .createdAt(crop.getCreatedAt())
                .updatedAt(crop.getUpdatedAt())
                .build();
    }

    // Static method to convert Farmer to FarmerDTO (similar to FarmerService)
    private static FarmerDTO convertToDTO(Farmer farmer) {
        if (farmer == null) return null;
        return FarmerDTO.builder()
                .id(farmer.getId())
                .user(AuthService.convertUserToDTO(farmer.getUser()))
                .farmName(farmer.getFarmName())
                .farmLocation(farmer.getFarmLocation())
                .cropType(farmer.getCropType())
                .verificationStatus(farmer.getVerificationStatus())
                .createdAt(farmer.getCreatedAt())
                .build();
    }
}
