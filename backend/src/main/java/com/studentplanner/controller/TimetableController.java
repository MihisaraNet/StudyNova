package com.studentplanner.controller;

import com.studentplanner.dto.request.StudySessionRequest;
import com.studentplanner.dto.response.ApiResponse;
import com.studentplanner.model.StudySession;
import com.studentplanner.model.User;
import com.studentplanner.repository.UserRepository;
import com.studentplanner.service.TimetableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;
    private final UserRepository userRepository;

    // ─── GET /api/timetable ────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudySession>>> getTimetable(Authentication authentication) {
        String userId = getUserId(authentication);
        List<StudySession> sessions = timetableService.getSessionsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Timetable fetched successfully", sessions));
    }

    // ─── POST /api/timetable ───────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<StudySession>> createSession(
            @Valid @RequestBody StudySessionRequest request,
            Authentication authentication) {
        String userId = getUserId(authentication);
        StudySession session = timetableService.createSession(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Study session created successfully", session));
    }

    // ─── PUT /api/timetable/{id} ───────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudySession>> updateSession(
            @PathVariable String id,
            @Valid @RequestBody StudySessionRequest request,
            Authentication authentication) {
        String userId = getUserId(authentication);
        StudySession updated = timetableService.updateSession(id, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Study session updated successfully", updated));
    }

    // ─── DELETE /api/timetable/{id} ────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSession(
            @PathVariable String id,
            Authentication authentication) {
        String userId = getUserId(authentication);
        timetableService.deleteSession(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Study session deleted successfully"));
    }

    private String getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getId();
    }
}
