package com.studentplanner.repository;

import com.studentplanner.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends MongoRepository<Subject, String> {
    List<Subject> findByUserId(String userId);
    List<Subject> findByUserIdAndSemester(String userId, String semester);
    Optional<Subject> findByIdAndUserId(String id, String userId);
}
