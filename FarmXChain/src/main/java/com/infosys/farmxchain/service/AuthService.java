package com.infosys.farmxchain.service;

import com.infosys.farmxchain.dto.FarmerDTO;
import com.infosys.farmxchain.dto.FarmerProfileRequest;
import com.infosys.farmxchain.dto.LoginRequest;
import com.infosys.farmxchain.dto.LoginResponse;
import com.infosys.farmxchain.dto.RegisterRequest;
import com.infosys.farmxchain.dto.UserDTO;
import com.infosys.farmxchain.entity.Farmer;
import com.infosys.farmxchain.entity.FarmerVerificationStatus;
import com.infosys.farmxchain.entity.Role;
import com.infosys.farmxchain.entity.User;
import com.infosys.farmxchain.entity.UserStatus;
import com.infosys.farmxchain.exception.EmailAlreadyExistsException;
import com.infosys.farmxchain.exception.ResourceNotFoundException;
import com.infosys.farmxchain.exception.UnauthorizedException;
import com.infosys.farmxchain.repository.FarmerRepository;
import com.infosys.farmxchain.repository.UserRepository;
import com.infosys.farmxchain.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public UserDTO register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        Role role = Role.valueOf(request.getRole().toUpperCase());

        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .status(UserStatus.PENDING)
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .isVerified(false)
                .walletAddress(request.getWalletAddress())
                .build();

        User savedUser = userRepository.save(user);

        // Create farmer profile if user role is FARMER
        if (Role.FARMER.equals(role)) {
            Farmer farmer = Farmer.builder()
                    .user(savedUser)
                    .farmName("Default Farm") // Default values, can be updated later
                    .farmLocation(request.getAddress() != null ? request.getAddress() : "Not specified")
                    .cropType("GENERAL")
                    .verificationStatus(FarmerVerificationStatus.PENDING)
                    .build();
            farmerRepository.save(farmer);
        }

        return convertUserToDTO(savedUser);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // Check if account is suspended/blocked
        if (UserStatus.SUSPENDED.equals(user.getStatus())) {
            throw new UnauthorizedException("Your account has been blocked by the administrator. Please contact support.");
        }

        // Enforce Admin Verification: Only ACTIVE users can login
        // Note: We usually allow ADMINs to bypass this if they are already active
        if (UserStatus.PENDING.equals(user.getStatus())) {
            throw new UnauthorizedException("Your account is pending admin verification. You will be able to login once approved.");
        }

        if (!UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new UnauthorizedException("Your account is not active. Please contact administrator.");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getExpirationTime())
                .user(convertUserToDTO(user))
                .build();
    }

    public UserDTO verifyUser(Long userId, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setStatus(UserStatus.ACTIVE);
        user.setIsVerified(true);
        User updatedUser = userRepository.save(user);

        return convertUserToDTO(updatedUser);
    }

    public UserDTO rejectUser(Long userId, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setStatus(UserStatus.SUSPENDED);
        User updatedUser = userRepository.save(user);

        return convertUserToDTO(updatedUser);
    }

    public static UserDTO convertUserToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .status(user.getStatus())
                .phoneNumber(user.getPhoneNumber())
                .isVerified(user.getIsVerified())
                .walletAddress(user.getWalletAddress())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .postalCode(user.getPostalCode())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .balance(user.getBalance())
                .build();
    }
}
