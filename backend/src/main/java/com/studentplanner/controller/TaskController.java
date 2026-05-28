package com.studentplanner.controller;

import com.studentplanner.dto.request.TaskRequest;
import com.studentplanner.dto.response.ApiResponse;
import com.studentplanner.model.Task;
import com.studentplanner.model.User;
import com.studentplanner.repository.UserRepository;
import com.studentplanner.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    // ─── POST /api/tasks ────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<Task>> createTask(
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {

        String userId = getUserId(authentication);
        Task created = taskService.createTask(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", created));
    }

    // ─── GET /api/tasks ─────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<List<Task>>> getAllTasks(
            @RequestParam(required = false) String subjectId,
            Authentication authentication) {

        String userId = getUserId(authentication);
        List<Task> tasks;
        if (subjectId != null && !subjectId.trim().isEmpty()) {
            tasks = taskService.getTasksByUserAndSubject(userId, subjectId);
        } else {
            tasks = taskService.getAllTasksByUser(userId);
        }
        return ResponseEntity.ok(ApiResponse.success("Tasks fetched successfully", tasks));
    }

    // ─── GET /api/tasks/{id} ────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getTask(
            @PathVariable String id,
            Authentication authentication) {

        String userId = getUserId(authentication);
        Task task = taskService.getTaskByIdAndUser(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Task fetched successfully", task));
    }

    // ─── PUT /api/tasks/{id} ────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> updateTask(
            @PathVariable String id,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {

        String userId = getUserId(authentication);
        Task updated = taskService.updateTask(id, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    // ─── DELETE /api/tasks/{id} ─────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable String id,
            Authentication authentication) {

        String userId = getUserId(authentication);
        taskService.deleteTask(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully"));
    }

    private String getUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getId();
    }
}
