package com.infosys.farmxchain.security;

import com.infosys.farmxchain.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof Long) {
            return (Long) authentication.getDetails();
        }
        throw new UnauthorizedException("User is not authenticated");
    }

    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return authentication.getName();
        }
        throw new UnauthorizedException("User is not authenticated");
    }

    public static String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && !authentication.getAuthorities().isEmpty()) {
            return authentication.getAuthorities().stream()
                    .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .findFirst()
                    .orElse(null);
        }
        throw new UnauthorizedException("User is not authenticated");
    }

    public static boolean isAdmin() {
        return getCurrentUserRole().equals("ADMIN");
    }

    public static boolean isFarmer() {
        return getCurrentUserRole().equals("FARMER");
    }
}
