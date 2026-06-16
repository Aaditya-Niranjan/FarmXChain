package com.infosys.farmxchain.controller;

import com.infosys.farmxchain.dto.ApiResponse;
import com.infosys.farmxchain.dto.LoginRequest;
import com.infosys.farmxchain.dto.LoginResponse;
import com.infosys.farmxchain.dto.RegisterRequest;
import com.infosys.farmxchain.dto.UserDTO;
import com.infosys.farmxchain.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "Register a new user", description = "Register a new user with the provided details")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody RegisterRequest request) {
        UserDTO user = authService.register(request);
        ApiResponse<UserDTO> response = ApiResponse.<UserDTO>builder()
                .success(true)
                .message("User registered successfully. Awaiting verification by admin.")
                .data(user)
                .statusCode(HttpStatus.CREATED.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        ApiResponse<LoginResponse> response = ApiResponse.<LoginResponse>builder()
                .success(true)
                .message("Login successful")
                .data(loginResponse)
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Validate token", description = "Validate the JWT token")
    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<String>> validateToken() {
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("Token is valid")
                .statusCode(HttpStatus.OK.value())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
