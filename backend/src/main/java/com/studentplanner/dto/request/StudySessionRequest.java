package com.studentplanner.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudySessionRequest {
    
    private String subjectId;
    private String subjectName;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Day of week is required")
    private String dayOfWeek;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;

    private String location;
    
    private String color;

    private boolean reminderEnabled;

    private int reminderMinutesBefore = 15;
}
