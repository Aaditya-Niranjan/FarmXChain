package com.infosys.farmxchain.dto;

import com.infosys.farmxchain.entity.Role;
import com.infosys.farmxchain.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private Role role;
    private UserStatus status;
    private String phoneNumber;
    private Boolean isVerified;
    private String walletAddress;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;
    private java.math.BigDecimal balance;
}
