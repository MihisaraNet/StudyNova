package com.studentplanner.controller;

import com.studentplanner.dto.response.ApiResponse;
import com.studentplanner.model.Assignment;
import com.studentplanner.model.StudySession;
import com.studentplanner.model.Subject;
import com.studentplanner.model.User;
import com.studentplanner.repository.UserRepository;
import com.studentplanner.service.AIService;
import com.studentplanner.service.AssignmentService;
import com.studentplanner.service.SubjectService;
import com.studentplanner.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;
    private final SubjectService subjectService;
    private final AssignmentService assignmentService;
    private final TimetableService timetableService;
    private final UserRepository userRepository;

    // ─── GET /api/ai/suggest ──────────────────────────────────────────────────
    @GetMapping("/suggest")
    public ResponseEntity<ApiResponse<String>> getSuggestions(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        String userId = user.getId();
        
        List<Subject> subjects = subjectService.getAllSubjectsByUser(userId);
        List<Assignment> assignments = assignmentService.getAllAssignmentsByUser(userId);
        List<StudySession> sessions = timetableService.getSessionsByUserId(userId);
        
        String suggestions = aiService.generateSuggestions(user, subjects, assignments, sessions);
        
        return ResponseEntity.ok(ApiResponse.success("AI suggestions generated successfully", suggestions));
    }
}
