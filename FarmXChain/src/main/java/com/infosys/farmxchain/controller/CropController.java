package com.infosys.farmxchain.controller;

import com.infosys.farmxchain.dto.ApiResponse;
import com.infosys.farmxchain.dto.CropDTO;
import com.infosys.farmxchain.dto.CropRequest;
import com.infosys.farmxchain.security.SecurityUtils;
import com.infosys.farmxchain.service.CropService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/crops")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CropController {

    @Autowired
    private CropService cropService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CropDTO>> addCrop(@Valid @RequestBody CropRequest request) {
        Long farmerId = SecurityUtils.getCurrentUserId();
        CropDTO crop = cropService.addCrop(farmerId, request);
        ApiResponse<CropDTO> response = ApiResponse.<CropDTO>builder()
                .success(true)
                .message("Crop added successfully and registered on blockchain")
                .data(crop)
                .statusCode(HttpStatus.CREATED.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-crops")
    public ResponseEntity<ApiResponse<List<CropDTO>>> getMyCrops() {
        Long farmerId = SecurityUtils.getCurrentUserId();
        List<CropDTO> crops = cropService.getCropsByFarmer(farmerId);
        ApiResponse<List<CropDTO>> response = ApiResponse.<List<CropDTO>>builder()
                .success(true)
                .message("Crops retrieved successfully")
                .data(crops)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{cropId}")
    public ResponseEntity<ApiResponse<CropDTO>> getCropById(@PathVariable Long cropId) {
        CropDTO crop = cropService.getCropById(cropId);
        ApiResponse<CropDTO> response = ApiResponse.<CropDTO>builder()
                .success(true)
                .message("Crop retrieved successfully")
                .data(crop)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CropDTO>>> getAllCrops() {
        List<CropDTO> crops = cropService.getAllCrops();
        ApiResponse<List<CropDTO>> response = ApiResponse.<List<CropDTO>>builder()
                .success(true)
                .message("All crops retrieved successfully")
                .data(crops)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/blockchain-records")
    public ResponseEntity<ApiResponse<List<CropDTO>>> getCropsWithBlockchainRecords() {
        List<CropDTO> crops = cropService.getCropsWithBlockchainRecords();
        ApiResponse<List<CropDTO>> response = ApiResponse.<List<CropDTO>>builder()
                .success(true)
                .message("Blockchain-verified crops retrieved successfully")
                .data(crops)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{cropId}/verify-blockchain")
    public ResponseEntity<ApiResponse<Boolean>> verifyBlockchainRecord(@PathVariable Long cropId) {
        boolean isValid = cropService.verifyBlockchainRecord(cropId);
        ApiResponse<Boolean> response = ApiResponse.<Boolean>builder()
                .success(true)
                .message(isValid ? "Blockchain record is valid" : "Blockchain record verification failed")
                .data(isValid)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
