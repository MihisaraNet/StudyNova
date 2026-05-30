package com.studentplanner.repository;

import com.studentplanner.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserId(String userId);
    List<Task> findByUserIdAndSubjectId(String userId, String subjectId);
    Optional<Task> findByIdAndUserId(String id, String userId);
}
