package com.collabspace.controller;

import com.collabspace.dto.*;
import com.collabspace.entity.RefreshToken;
import com.collabspace.service.AuthService;
import com.collabspace.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        log.info("Received login request for email: {}", request.getEmail());
        try {
            String deviceInfo = httpRequest.getHeader("User-Agent");
            String ipAddress = getClientIpAddress(httpRequest);
            AuthResponse response = authService.login(request, deviceInfo, ipAddress);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Received token refresh request");
        try {
            String requestRefreshToken = request.getRefreshToken();
            RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken)
                    .map(refreshTokenService::verifyExpiration)
                    .orElseThrow(() -> new RuntimeException("Refresh token not found"));

            String token = authService.generateAccessToken(refreshToken.getUser().getEmail());
            
            return ResponseEntity.ok(TokenRefreshResponse.builder()
                    .accessToken(token)
                    .refreshToken(requestRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(3600000L)
                    .message("Token refreshed successfully")
                    .build());
        } catch (RuntimeException e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(TokenRefreshResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(Principal principal, @RequestBody RefreshTokenRequest request) {
        String email = principal.getName();
        log.info("Logout request from user: {}", email);
        
        try {
            refreshTokenService.revokeToken(request.getRefreshToken());
            return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
        }
    }

    @PostMapping("/logout-all")
    public ResponseEntity<MessageResponse> logoutAllDevices(Principal principal) {
        String email = principal.getName();
        log.info("Logout all devices request from user: {}", email);
        
        refreshTokenService.revokeAllUserTokens(email);
        return ResponseEntity.ok(new MessageResponse("Logged out from all devices successfully"));
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
