package com.lms.openlms.dto;

import java.util.List;
import java.util.Map;

public class QuizDto {

    public static class CreateOptionRequest {
        private String optionText;
        private Boolean isCorrect;

        public CreateOptionRequest() {}

        public String getOptionText() {
            return optionText;
        }

        public void setOptionText(String optionText) {
            this.optionText = optionText;
        }

        public Boolean getIsCorrect() {
            return isCorrect;
        }

        public void setIsCorrect(Boolean isCorrect) {
            this.isCorrect = isCorrect;
        }
    }

    public static class CreateQuestionRequest {
        private String questionText;
        private Integer marks;
        private List<CreateOptionRequest> options;

        public CreateQuestionRequest() {}

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public Integer getMarks() {
            return marks;
        }

        public void setMarks(Integer marks) {
            this.marks = marks;
        }

        public List<CreateOptionRequest> getOptions() {
            return options;
        }

        public void setOptions(List<CreateOptionRequest> options) {
            this.options = options;
        }
    }

    public static class CreateQuizRequest {
        private Long courseId;
        private String title;
        private Integer totalMarks;
        private Long createdById;
        private List<CreateQuestionRequest> questions;

        public CreateQuizRequest() {}

        public Long getCourseId() {
            return courseId;
        }

        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public Integer getTotalMarks() {
            return totalMarks;
        }

        public void setTotalMarks(Integer totalMarks) {
            this.totalMarks = totalMarks;
        }

        public Long getCreatedById() {
            return createdById;
        }

        public void setCreatedById(Long createdById) {
            this.createdById = createdById;
        }

        public List<CreateQuestionRequest> getQuestions() {
            return questions;
        }

        public void setQuestions(List<CreateQuestionRequest> questions) {
            this.questions = questions;
        }
    }

    public static class QuizOptionResponse {
        private Long optionId;
        private String optionText;
        private Boolean isCorrect;

        public QuizOptionResponse() {}

        public QuizOptionResponse(Long optionId, String optionText, Boolean isCorrect) {
            this.optionId = optionId;
            this.optionText = optionText;
            this.isCorrect = isCorrect;
        }

        public Long getOptionId() {
            return optionId;
        }

        public void setOptionId(Long optionId) {
            this.optionId = optionId;
        }

        public String getOptionText() {
            return optionText;
        }

        public void setOptionText(String optionText) {
            this.optionText = optionText;
        }

        public Boolean getIsCorrect() {
            return isCorrect;
        }

        public void setIsCorrect(Boolean isCorrect) {
            this.isCorrect = isCorrect;
        }
    }

    public static class QuizQuestionResponse {
        private Long questionId;
        private String questionText;
        private Integer marks;
        private List<QuizOptionResponse> options;

        public QuizQuestionResponse() {}

        public QuizQuestionResponse(Long questionId, String questionText, Integer marks, List<QuizOptionResponse> options) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.marks = marks;
            this.options = options;
        }

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public Integer getMarks() {
            return marks;
        }

        public void setMarks(Integer marks) {
            this.marks = marks;
        }

        public List<QuizOptionResponse> getOptions() {
            return options;
        }

        public void setOptions(List<QuizOptionResponse> options) {
            this.options = options;
        }
    }

    public static class QuizResponse {
        private Long quizId;
        private Long courseId;
        private String courseName;
        private String courseCode;
        private String title;
        private Integer totalMarks;
        private Long createdById;
        private List<QuizQuestionResponse> questions;

        public QuizResponse() {}

        public Long getQuizId() {
            return quizId;
        }

        public void setQuizId(Long quizId) {
            this.quizId = quizId;
        }

        public Long getId() {
            return quizId;
        }

        public Long getCourseId() {
            return courseId;
        }

        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }

        public String getCourseName() {
            return courseName;
        }

        public void setCourseName(String courseName) {
            this.courseName = courseName;
        }

        public String getCourseCode() {
            return courseCode;
        }

        public void setCourseCode(String courseCode) {
            this.courseCode = courseCode;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public Integer getTotalMarks() {
            return totalMarks;
        }

        public void setTotalMarks(Integer totalMarks) {
            this.totalMarks = totalMarks;
        }

        public Long getCreatedById() {
            return createdById;
        }

        public void setCreatedById(Long createdById) {
            this.createdById = createdById;
        }

        public List<QuizQuestionResponse> getQuestions() {
            return questions;
        }

        public void setQuestions(List<QuizQuestionResponse> questions) {
            this.questions = questions;
        }
    }

    public static class QuizAttemptRequest {
        private Long studentId;
        // questionId -> selectedOptionId
        private Map<Long, Long> answers;

        public QuizAttemptRequest() {}

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public Map<Long, Long> getAnswers() {
            return answers;
        }

        public void setAnswers(Map<Long, Long> answers) {
            this.answers = answers;
        }
    }

    public static class QuizAttemptResponse {
        private Long attemptId;
        private Long quizId;
        private Long studentId;
        private Integer score;
        private Integer totalMarks;

        public QuizAttemptResponse() {}

        public QuizAttemptResponse(Long attemptId, Long quizId, Long studentId, Integer score, Integer totalMarks) {
            this.attemptId = attemptId;
            this.quizId = quizId;
            this.studentId = studentId;
            this.score = score;
            this.totalMarks = totalMarks;
        }

        public Long getAttemptId() {
            return attemptId;
        }

        public void setAttemptId(Long attemptId) {
            this.attemptId = attemptId;
        }

        public Long getQuizId() {
            return quizId;
        }

        public void setQuizId(Long quizId) {
            this.quizId = quizId;
        }

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
        }

        public Integer getTotalMarks() {
            return totalMarks;
        }

        public void setTotalMarks(Integer totalMarks) {
            this.totalMarks = totalMarks;
        }
    }
}
