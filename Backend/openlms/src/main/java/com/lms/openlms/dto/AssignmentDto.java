package com.lms.openlms.dto;

import java.time.LocalDateTime;

public class AssignmentDto {

    public static class CreateAssignmentRequest {
        private Long courseId;
        private String title;
        private LocalDateTime dueDate;
        private Integer maxMarks;
        private Long createdById;
        private String description;

        public CreateAssignmentRequest() {}

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

        public LocalDateTime getDueDate() {
            return dueDate;
        }

        public void setDueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
        }

        public Integer getMaxMarks() {
            return maxMarks;
        }

        public void setMaxMarks(Integer maxMarks) {
            this.maxMarks = maxMarks;
        }

        public Long getCreatedById() {
            return createdById;
        }

        public void setCreatedById(Long createdById) {
            this.createdById = createdById;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class AssignmentResponse {
        private Long assignmentId;
        private Long courseId;
        private String courseName;
        private String courseCode;
        private String title;
        private LocalDateTime dueDate;
        private Integer maxMarks;
        private Long createdById;
        private String createdByName;
        private String status; // "todo", "submitted", "graded"
        private Integer marksObtained;

        public AssignmentResponse() {}

        public Long getAssignmentId() {
            return assignmentId;
        }

        public void setAssignmentId(Long assignmentId) {
            this.assignmentId = assignmentId;
        }

        public Long getId() {
            return assignmentId;
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

        public LocalDateTime getDueDate() {
            return dueDate;
        }

        public void setDueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
        }

        public Integer getMaxMarks() {
            return maxMarks;
        }

        public void setMaxMarks(Integer maxMarks) {
            this.maxMarks = maxMarks;
        }

        public Long getCreatedById() {
            return createdById;
        }

        public void setCreatedById(Long createdById) {
            this.createdById = createdById;
        }

        public String getCreatedByName() {
            return createdByName;
        }

        public void setCreatedByName(String createdByName) {
            this.createdByName = createdByName;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Integer getMarksObtained() {
            return marksObtained;
        }

        public void setMarksObtained(Integer marksObtained) {
            this.marksObtained = marksObtained;
        }
    }
}
