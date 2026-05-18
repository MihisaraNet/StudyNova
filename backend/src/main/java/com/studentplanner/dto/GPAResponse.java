package com.studentplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GPAResponse {
    private double overallGPA;
    private int totalCredits;
    private Map<String, Double> semesterGPAs;
}
