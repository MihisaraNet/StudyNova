package com.studentplanner.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String subjectId; // References Subject id (optional)
    
    private String subjectName; // Cached subject name for easy display

    private String title;
    private String description;
    
    private LocalDateTime dueDate;

    @Builder.Default
    private String status = "PENDING"; // PENDING, COMPLETED, OVERDUE

    @Builder.Default
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH

    @Builder.Default
    private Double estimatedHours = 2.0;

    @Builder.Default
    private Integer reminderMinutesBefore = 60;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
}
