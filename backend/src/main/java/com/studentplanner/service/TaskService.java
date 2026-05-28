package com.studentplanner.service;

import com.studentplanner.dto.request.TaskRequest;
import com.studentplanner.exception.ResourceNotFoundException;
import com.studentplanner.model.Task;
import com.studentplanner.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Task createTask(String userId, TaskRequest request) {
        Task task = Task.builder()
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
        
        return taskRepository.save(task);
    }

    public List<Task> getAllTasksByUser(String userId) {
        return taskRepository.findByUserId(userId);
    }

    public List<Task> getTasksByUserAndSubject(String userId, String subjectId) {
        return taskRepository.findByUserIdAndSubjectId(userId, subjectId);
    }

    public Task getTaskByIdAndUser(String id, String userId) {
        return taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found or access denied"));
    }

    public Task updateTask(String id, String userId, TaskRequest request) {
        Task task = getTaskByIdAndUser(id, userId);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setSubjectId(request.getSubjectId());
        task.setSubjectName(request.getSubjectName());
        
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            task.setStatus(request.getStatus().toUpperCase());
        }
        
        if (request.getPriority() != null && !request.getPriority().isEmpty()) {
            task.setPriority(request.getPriority().toUpperCase());
        }
        
        if (request.getEstimatedHours() != null) {
            task.setEstimatedHours(request.getEstimatedHours());
        }
        
        if (request.getReminderMinutesBefore() != null) {
            task.setReminderMinutesBefore(request.getReminderMinutesBefore());
        }
        
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    public void deleteTask(String id, String userId) {
        Task task = getTaskByIdAndUser(id, userId);
        taskRepository.delete(task);
    }
}
