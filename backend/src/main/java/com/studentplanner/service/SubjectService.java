package com.studentplanner.service;

import com.studentplanner.dto.request.SubjectRequest;
import com.studentplanner.exception.ResourceNotFoundException;
import com.studentplanner.model.Subject;
import com.studentplanner.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public Subject createSubject(String userId, SubjectRequest request) {
        Subject subject = Subject.builder()
                .userId(userId)
                .name(request.getName())
                .code(request.getCode())
                .credits(request.getCredits())
                .semester(request.getSemester())
                .grade(request.getGrade())
                .build();
        return subjectRepository.save(subject);
    }

    public List<Subject> getAllSubjectsByUser(String userId) {
        return subjectRepository.findByUserId(userId);
    }

    public List<Subject> getSubjectsByUserAndSemester(String userId, String semester) {
        return subjectRepository.findByUserIdAndSemester(userId, semester);
    }

    public Subject getSubjectByIdAndUser(String id, String userId) {
        return subjectRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found or access denied"));
    }

    public Subject updateSubject(String id, String userId, SubjectRequest request) {
        Subject subject = getSubjectByIdAndUser(id, userId);

        subject.setName(request.getName());
        subject.setCode(request.getCode());
        subject.setCredits(request.getCredits());
        subject.setSemester(request.getSemester());
        subject.setGrade(request.getGrade());
        subject.setUpdatedAt(LocalDateTime.now());

        return subjectRepository.save(subject);
    }

    public void deleteSubject(String id, String userId) {
        Subject subject = getSubjectByIdAndUser(id, userId);
        subjectRepository.delete(subject);
    }
}
