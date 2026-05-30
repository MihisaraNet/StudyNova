package com.studentplanner.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;

    private String subjectId; // Optional subject mapping
    private String subjectName; // Optional subject name cache

    private String status; // PENDING, COMPLETED, etc.
    private String priority; // LOW, MEDIUM, HIGH

    private Double estimatedHours;
    private Integer reminderMinutesBefore;
}
