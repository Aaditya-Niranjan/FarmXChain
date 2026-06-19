package com.infosys.farmxchain.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private com.infosys.farmxchain.repository.UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {

            String token = extractTokenFromRequest(request);

            System.out.println("Received Token: " + token);

            if (token != null && jwtTokenProvider.isTokenValid(token)) {

                System.out.println("JWT token is valid");

                String email = jwtTokenProvider.extractEmail(token);
                Long userId = jwtTokenProvider.extractUserId(token);

                System.out.println("Email from token: " + email);
                System.out.println("User ID from token: " + userId);

                var userOpt = userRepository.findById(userId);

                if (userOpt.isPresent()) {

                    var user = userOpt.get();

                    System.out.println("User found in DB: " + user.getEmail());
                    System.out.println("User Status: " + user.getStatus());

                    // Block suspended users
                    if (com.infosys.farmxchain.entity.UserStatus.SUSPENDED
                            .equals(user.getStatus())) {

                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");

                        response.getWriter().write(
                                "{\"success\":false,\"message\":\"Your account has been blocked by the administrator.\",\"statusCode\":403}"
                        );

                        return;
                    }

                    String role = user.getRole().name();

                    List<SimpleGrantedAuthority> authorities =
                            new ArrayList<>();

                    authorities.add(
                            new SimpleGrantedAuthority("ROLE_" + role)
                    );

                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    authorities
                            );

                    authenticationToken.setDetails(userId);

                    System.out.println(
                            "Setting authentication for user: " + email
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authenticationToken);
                } else {
                    System.out.println("User not found in database");
                }

            } else {
                System.out.println("Token is invalid or missing");
            }

        } catch (Exception ex) {

            ex.printStackTrace();

            logger.error(
                    "Cannot set user authentication: {}",
                    ex.getMessage()
            );
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(
            HttpServletRequest request) {

        String bearerToken =
                request.getHeader("Authorization");

        if (bearerToken != null &&
                bearerToken.startsWith("Bearer ")) {

            return bearerToken.substring(7);
        }

        return null;
    }
}