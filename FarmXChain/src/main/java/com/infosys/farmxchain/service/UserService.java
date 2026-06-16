package com.infosys.farmxchain.service;

import com.infosys.farmxchain.dto.UserDTO;
import com.infosys.farmxchain.entity.Role;
import com.infosys.farmxchain.entity.User;
import com.infosys.farmxchain.entity.UserStatus;
import com.infosys.farmxchain.exception.ResourceNotFoundException;
import com.infosys.farmxchain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return AuthService.convertUserToDTO(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return AuthService.convertUserToDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(AuthService::convertUserToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByRole(String role) {
        Role userRole = Role.valueOf(role.toUpperCase());
        return userRepository.findByRole(userRole)
                .stream()
                .map(AuthService::convertUserToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllFarmers() {
        return userRepository.findByRole(Role.FARMER)
                .stream()
                .map(AuthService::convertUserToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllDistributors() {
        return userRepository.findByRole(Role.DISTRIBUTOR)
                .stream()
                .map(AuthService::convertUserToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllRetailers() {
        return userRepository.findByRole(Role.RETAILER)
                .stream()
                .map(AuthService::convertUserToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllConsumers() {
        return userRepository.findByRole(Role.CONSUMER)
                .stream()
                .map(AuthService::convertUserToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getPendingUsers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> UserStatus.PENDING.equals(u.getStatus()))
                .map(AuthService::convertUserToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        try {
            user.setStatus(UserStatus.valueOf(status.toUpperCase()));
            User updatedUser = userRepository.save(user);
            return AuthService.convertUserToDTO(updatedUser);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid user status: " + status);
        }
    }

    public UserDTO topUpBalance(Long userId, java.math.BigDecimal amount) {
        if (amount.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Top-up amount must be positive");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        user.setBalance(user.getBalance().add(amount));
        User updatedUser = userRepository.save(user);
        return AuthService.convertUserToDTO(updatedUser);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        userRepository.delete(user);
    }
}
