package com.studentplanner.service;

import com.studentplanner.dto.GPAResponse;
import com.studentplanner.model.Subject;
import com.studentplanner.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GPAService {

    private final SubjectRepository subjectRepository;

    public GPAResponse calculateGPA(String userId) {
        List<Subject> subjects = subjectRepository.findByUserId(userId);
        
        double overallGPA = 0.0;
        int totalCredits = 0;
        double totalGradePoints = 0.0;
        
        Map<String, Double> semesterGPAs = new HashMap<>();
        Map<String, List<Subject>> subjectsBySemester = subjects.stream()
                .filter(s -> s.getSemester() != null && !s.getSemester().isEmpty())
                .collect(Collectors.groupingBy(Subject::getSemester));

        for (Map.Entry<String, List<Subject>> entry : subjectsBySemester.entrySet()) {
            String semester = entry.getKey();
            List<Subject> semSubjects = entry.getValue();
            
            double semTotalGradePoints = 0.0;
            int semTotalCredits = 0;
            
            for (Subject subject : semSubjects) {
                if (subject.getGrade() != null && !subject.getGrade().isEmpty() && subject.getCredits() != null) {
                    double point = convertGradeToPoint(subject.getGrade());
                    if (point >= 0) { // ignore grades that are not standard (e.g. "W", "P")
                        semTotalGradePoints += point * subject.getCredits();
                        semTotalCredits += subject.getCredits();
                    }
                }
            }
            
            if (semTotalCredits > 0) {
                double semGPA = semTotalGradePoints / semTotalCredits;
                semesterGPAs.put(semester, Math.round(semGPA * 100.0) / 100.0);
                
                totalGradePoints += semTotalGradePoints;
                totalCredits += semTotalCredits;
            } else {
                semesterGPAs.put(semester, 0.0);
            }
        }

        if (totalCredits > 0) {
            overallGPA = totalGradePoints / totalCredits;
        }

        return GPAResponse.builder()
                .overallGPA(Math.round(overallGPA * 100.0) / 100.0)
                .totalCredits(totalCredits)
                .semesterGPAs(semesterGPAs)
                .build();
    }

    private double convertGradeToPoint(String grade) {
        switch (grade.toUpperCase().trim()) {
            case "A+":
            case "A":
                return 4.0;
            case "A-":
                return 3.7;
            case "B+":
                return 3.3;
            case "B":
                return 3.0;
            case "B-":
                return 2.7;
            case "C+":
                return 2.3;
            case "C":
                return 2.0;
            case "C-":
                return 1.7;
            case "D+":
                return 1.3;
            case "D":
                return 1.0;
            case "F":
            case "E":
                return 0.0;
            default:
                return -1.0; // Invalid or non-computable grade
        }
    }
}
