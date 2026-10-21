package com.lms.openlms.repository;

import com.lms.openlms.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizQuizId(Long quizId);
    List<QuizAttempt> findByStudentUserId(Long studentId);
    Optional<QuizAttempt> findByQuizQuizIdAndStudentUserId(Long quizId, Long studentId);
}
