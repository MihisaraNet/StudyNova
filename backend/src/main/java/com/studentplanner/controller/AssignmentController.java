package com.studentplanner.controller;

import com.studentplanner.dto.request.AssignmentRequest;
import com.studentplanner.dto.response.ApiResponse;
import com.studentplanner.model.Assignment;
import com.studentplanner.model.User;
import com.studentplanner.repository.UserRepository;
import com.studentplanner.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final UserRepository userRepository;

    // ─── POST /api/assignments ────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(
            @Valid @RequestBody AssignmentRequest request,
            Authentication authentication) {

        String userId = getUserId(authentication);
        Assignment created = assignmentService.createAssignment(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment created successfully", created));
    }

    // ─── GET /api/assignments ─────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<List<Assignment>>> getAllAssignments(
            @RequestParam(required = false) String subjectId,
            Authentication authentication) {

        String userId = getUserId(authentication);
        List<Assignment> assignments;
        if (subjectId != null && !subjectId.trim().isEmpty()) {
            assignments = assignmentService.getAssignmentsByUserAndSubject(userId, subjectId);
        } else {
            assignments = assignmentService.getAllAssignmentsByUser(userId);
        }
        return ResponseEntity.ok(ApiResponse.success("Assignments fetched successfully", assignments));
    }

    // ─── GET /api/assignments/{id} ────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Assignment>> getAssignment(
            @PathVariable String id,
            Authentication authentication) {

        String userId = getUserId(authentication);
        Assignment assignment = assignmentService.getAssignmentByIdAndUser(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Assignment fetched successfully", assignment));
    }

    // ─── PUT /api/assignments/{id} ────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Assignment>> updateAssignment(
            @PathVariable String id,
            @Valid @RequestBody AssignmentRequest request,
            Authentication authentication) {

        String userId = getUserId(authentication);
        Assignment updated = assignmentService.updateAssignment(id, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Assignment updated successfully", updated));
    }

    // ─── DELETE /api/assignments/{id} ─────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(
            @PathVariable String id,
            Authentication authentication) {

        String userId = getUserId(authentication);
        assignmentService.deleteAssignment(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Assignment deleted successfully"));
    }

    private String getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getId();
    }
}
