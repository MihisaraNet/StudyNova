package com.studentplanner.repository;

import com.studentplanner.model.StudySession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudySessionRepository extends MongoRepository<StudySession, String> {
    List<StudySession> findByUserId(String userId);
    Optional<StudySession> findByIdAndUserId(String id, String userId);
}
