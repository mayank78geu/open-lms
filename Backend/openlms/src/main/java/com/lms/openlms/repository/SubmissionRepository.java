package com.lms.openlms.repository;

import com.lms.openlms.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByAssignmentAssignmentId(Long assignmentId);
    List<Submission> findByStudentUserId(Long studentId);
    Optional<Submission> findByAssignmentAssignmentIdAndStudentUserId(Long assignmentId, Long studentId);
    List<Submission> findByAssignmentCourseCourseId(Long courseId);
    long countByAssignmentAssignmentId(Long assignmentId);
    boolean existsByAssignmentAssignmentId(Long assignmentId);
}
