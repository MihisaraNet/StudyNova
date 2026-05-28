package com.studentplanner.repository;

import com.studentplanner.model.Assignment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    List<Assignment> findByUserId(String userId);
    List<Assignment> findByUserIdAndSubjectId(String userId, String subjectId);
    Optional<Assignment> findByIdAndUserId(String id, String userId);
}
