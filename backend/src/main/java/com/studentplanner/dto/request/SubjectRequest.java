package com.studentplanner.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubjectRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Code is required")
    private String code;

    @NotNull(message = "Credits are required")
    private Integer credits;

    @NotBlank(message = "Semester is required")
    private String semester;
    
    private String grade;
}
