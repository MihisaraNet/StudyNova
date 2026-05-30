package com.studentplanner.controller;

import com.studentplanner.dto.request.SubjectRequest;
import com.studentplanner.dto.response.ApiResponse;
import com.studentplanner.model.Subject;
import com.studentplanner.model.User;
import com.studentplanner.repository.UserRepository;
import com.studentplanner.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;
    private final UserRepository userRepository;

    // ─── POST /api/subjects ───────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<Subject>> createSubject(
            @Valid @RequestBody SubjectRequest request,
            Authentication authentication) {

        String userId = getUserId(authentication);
        Subject created = subjectService.createSubject(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subject created successfully", created));
    }

    // ─── GET /api/subjects ────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<List<Subject>>> getAllSubjects(
            Authentication authentication) {

        String userId = getUserId(authentication);
        List<Subject> subjects = subjectService.getAllSubjectsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Subjects fetched successfully", subjects));
    }

    // ─── GET /api/subjects/{id} ───────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Subject>> getSubject(
            @PathVariable String id,
            Authentication authentication) {

        String userId = getUserId(authentication);
        Subject subject = subjectService.getSubjectByIdAndUser(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Subject fetched successfully", subject));
    }

    // ─── PUT /api/subjects/{id} ───────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Subject>> updateSubject(
            @PathVariable String id,
            @Valid @RequestBody SubjectRequest request,
            Authentication authentication) {

        String userId = getUserId(authentication);
        Subject updated = subjectService.updateSubject(id, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Subject updated successfully", updated));
    }

    // ─── DELETE /api/subjects/{id} ────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(
            @PathVariable String id,
            Authentication authentication) {

        String userId = getUserId(authentication);
        subjectService.deleteSubject(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Subject deleted successfully"));
    }

    private String getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getId();
    }
}
