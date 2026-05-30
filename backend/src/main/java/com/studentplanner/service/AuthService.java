package com.studentplanner.service;

import com.studentplanner.dto.request.LoginRequest;
import com.studentplanner.dto.request.RegisterRequest;
import com.studentplanner.dto.response.AuthResponse;
import com.studentplanner.model.User;
import com.studentplanner.repository.UserRepository;
import com.studentplanner.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    // ─── Register ─────────────────────────────────────────────────────────────

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered. Please login.");
        }

        // Build and save user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        // Generate JWT
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.of(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    // ─── Login ────────────────────────────────────────────────────────────────

    public AuthResponse login(LoginRequest request) {
        // Throws BadCredentialsException if wrong credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.of(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    // ─── Get current user profile ─────────────────────────────────────────────

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // ─── Update profile ───────────────────────────────────────────────────────

    public User updateProfile(String email, String name) {
        User user = getUserByEmail(email);
        if (name != null) user.setName(name);
        user.setUpdatedAt(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    // ─── Change password ──────────────────────────────────────────────────────

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);
    }

    // ─── Forgot password ──────────────────────────────────────────────────────

    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("No user found with this email address."));

        // Generate a secure temporary password
        String tempPassword = "Nova-" + (1000 + new java.util.Random().nextInt(9000));

        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        // Print to system output for easy local development log tracking
        System.out.println("=========================================");
        System.out.println("PASSWORD RESET REQUEST");
        System.out.println("Email: " + email);
        System.out.println("Temp Password: " + tempPassword);
        System.out.println("=========================================");

        return tempPassword;
    }
}
