package com.studentplanner.service;

import com.studentplanner.dto.request.StudySessionRequest;
import com.studentplanner.exception.ResourceNotFoundException;
import com.studentplanner.model.StudySession;
import com.studentplanner.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableService {

    private final StudySessionRepository studySessionRepository;

    public List<StudySession> getSessionsByUserId(String userId) {
        return studySessionRepository.findByUserId(userId);
    }

    public StudySession createSession(String userId, StudySessionRequest request) {
        StudySession session = StudySession.builder()
                .userId(userId)
                .subjectId(request.getSubjectId())
                .subjectName(request.getSubjectName())
                .title(request.getTitle())
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .location(request.getLocation())
                .color(request.getColor() != null && !request.getColor().isEmpty() ? request.getColor() : "#6366f1")
                .reminderEnabled(request.isReminderEnabled())
                .reminderMinutesBefore(request.getReminderMinutesBefore())
                .build();
        return studySessionRepository.save(session);
    }

    public StudySession updateSession(String id, String userId, StudySessionRequest request) {
        StudySession session = studySessionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Study session not found or access denied"));

        session.setSubjectId(request.getSubjectId());
        session.setSubjectName(request.getSubjectName());
        session.setTitle(request.getTitle());
        session.setDayOfWeek(request.getDayOfWeek());
        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());
        session.setLocation(request.getLocation());
        if (request.getColor() != null && !request.getColor().isEmpty()) {
            session.setColor(request.getColor());
        }
        session.setReminderEnabled(request.isReminderEnabled());
        session.setReminderMinutesBefore(request.getReminderMinutesBefore());
        session.setUpdatedAt(LocalDateTime.now());

        return studySessionRepository.save(session);
    }

    public void deleteSession(String id, String userId) {
        StudySession session = studySessionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Study session not found or access denied"));
        studySessionRepository.delete(session);
    }
}
