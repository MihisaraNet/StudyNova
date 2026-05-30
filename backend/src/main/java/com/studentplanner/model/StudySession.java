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
@Document(collection = "study_sessions")
public class StudySession {
    
    @Id
    private String id;

    @Indexed
    private String userId;

    private String subjectId; // References Subject id
    private String subjectName; // Cached for easy listing

    private String title;
    private String dayOfWeek; // e.g., "Monday", "Tuesday"
    private String startTime; // e.g., "09:00"
    private String endTime;   // e.g., "10:30"
    private String location;
    
    @Builder.Default
    private String color = "#6366f1"; // Indigo default hex
    
    private boolean reminderEnabled;
    
    @Builder.Default
    private int reminderMinutesBefore = 15;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}
