package com.studentplanner.controller;

import com.studentplanner.dto.GPAResponse;
import com.studentplanner.dto.response.ApiResponse;
import com.studentplanner.service.GPAService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gpa")
@RequiredArgsConstructor
public class GPAController {

    private final GPAService gpaService;
    private final com.studentplanner.repository.UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<GPAResponse>> getGPA(Authentication authentication) {
        String email = authentication.getName();
        String userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"))
                .getId();
        GPAResponse response = gpaService.calculateGPA(userId);
        return ResponseEntity.ok(ApiResponse.success("GPA fetched successfully", response));
    }
}
