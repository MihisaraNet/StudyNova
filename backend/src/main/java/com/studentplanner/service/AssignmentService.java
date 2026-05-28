package com.studentplanner.service;

import com.studentplanner.dto.request.AssignmentRequest;
import com.studentplanner.exception.ResourceNotFoundException;
import com.studentplanner.model.Assignment;
import com.studentplanner.repository.AssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    public Assignment createAssignment(String userId, AssignmentRequest request) {
        Assignment assignment = Assignment.builder()
                .userId(userId)
                .subjectId(request.getSubjectId())
                .subjectName(request.getSubjectName())
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status(request.getStatus() != null && !request.getStatus().isEmpty() ? request.getStatus().toUpperCase() : "PENDING")
                .priority(request.getPriority() != null && !request.getPriority().isEmpty() ? request.getPriority().toUpperCase() : "MEDIUM")
                .estimatedHours(request.getEstimatedHours() != null ? request.getEstimatedHours() : 2.0)
                .reminderMinutesBefore(request.getReminderMinutesBefore() != null ? request.getReminderMinutesBefore() : 60)
                .createdAt(LocalDateTime.now())
                .build();
        
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAllAssignmentsByUser(String userId) {
        return assignmentRepository.findByUserId(userId);
    }

    public List<Assignment> getAssignmentsByUserAndSubject(String userId, String subjectId) {
        return assignmentRepository.findByUserIdAndSubjectId(userId, subjectId);
    }

    public Assignment getAssignmentByIdAndUser(String id, String userId) {
        return assignmentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found or access denied"));
    }

    public Assignment updateAssignment(String id, String userId, AssignmentRequest request) {
        Assignment assignment = getAssignmentByIdAndUser(id, userId);

        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());
        assignment.setSubjectId(request.getSubjectId());
        assignment.setSubjectName(request.getSubjectName());
        
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            assignment.setStatus(request.getStatus().toUpperCase());
        }
        
        if (request.getPriority() != null && !request.getPriority().isEmpty()) {
            assignment.setPriority(request.getPriority().toUpperCase());
        }
        
        if (request.getEstimatedHours() != null) {
            assignment.setEstimatedHours(request.getEstimatedHours());
        }
        
        if (request.getReminderMinutesBefore() != null) {
            assignment.setReminderMinutesBefore(request.getReminderMinutesBefore());
        }
        
        assignment.setUpdatedAt(LocalDateTime.now());

        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(String id, String userId) {
        Assignment assignment = getAssignmentByIdAndUser(id, userId);
        assignmentRepository.delete(assignment);
    }
}
