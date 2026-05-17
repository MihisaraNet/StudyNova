package com.studentplanner.controller;

import com.studentplanner.dto.request.LoginRequest;
import com.studentplanner.dto.request.RegisterRequest;
import com.studentplanner.dto.response.ApiResponse;
import com.studentplanner.dto.response.AuthResponse;
import com.studentplanner.model.User;
import com.studentplanner.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ─── POST /api/auth/register ──────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse authResponse = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful! Welcome aboard.", authResponse));
    }

    // ─── POST /api/auth/login ─────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful!", authResponse));
    }

    // ─── GET /api/auth/me ─────────────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        // Remove password before returning
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success("User profile fetched", user));
    }

    // ─── PUT /api/auth/profile ────────────────────────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            @RequestBody Map<String, Object> updates,
            Authentication authentication) {

        String name     = (String) updates.get("name");
        String semester = (String) updates.get("semester");
        Double gpaTarget = updates.get("gpaTarget") != null
                ? Double.parseDouble(updates.get("gpaTarget").toString()) : null;

        User updated = authService.updateProfile(authentication.getName(), name, semester, gpaTarget);
        updated.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    // ─── PUT /api/auth/change-password ────────────────────────────────────────
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestBody Map<String, String> body,
            Authentication authentication) {

        authService.changePassword(
                authentication.getName(),
                body.get("currentPassword"),
                body.get("newPassword")
        );
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    // ─── POST /api/auth/logout ────────────────────────────────────────────────
    // JWT is stateless — logout handled client-side by deleting the token
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully. Delete token on client."));
    }
}
