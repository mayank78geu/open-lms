package com.lms.openlms.dto;

public class SubmissionDto {

    public static class CreateSubmissionRequest {
        private Long assignmentId;
        private Long studentId;
        private String submissionText;
        private String status = "Submitted";

        public CreateSubmissionRequest() {}

        public Long getAssignmentId() {
            return assignmentId;
        }

        public void setAssignmentId(Long assignmentId) {
            this.assignmentId = assignmentId;
        }

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public String getSubmissionText() {
            return submissionText;
        }

        public void setSubmissionText(String submissionText) {
            this.submissionText = submissionText;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class GradeSubmissionRequest {
        private Integer marksObtained;
        private String status = "Graded";
        private String feedback;

        public GradeSubmissionRequest() {}

        public Integer getMarksObtained() {
            return marksObtained;
        }

        public void setMarksObtained(Integer marksObtained) {
            this.marksObtained = marksObtained;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getFeedback() {
            return feedback;
        }

        public void setFeedback(String feedback) {
            this.feedback = feedback;
        }
    }

    public static class SubmissionResponse {
        private Long submissionId;
        private Long assignmentId;
        private String assignmentTitle;
        private Integer maxMarks;
        private Long studentId;
        private String studentName;
        private String studentEmail;
        private String status;
        private Integer marksObtained;
        private String submissionText;

        public SubmissionResponse() {}

        public Long getSubmissionId() {
            return submissionId;
        }

        public void setSubmissionId(Long submissionId) {
            this.submissionId = submissionId;
        }

        public Long getId() {
            return submissionId;
        }

        public Long getAssignmentId() {
            return assignmentId;
        }

        public void setAssignmentId(Long assignmentId) {
            this.assignmentId = assignmentId;
        }

        public String getAssignmentTitle() {
            return assignmentTitle;
        }

        public void setAssignmentTitle(String assignmentTitle) {
            this.assignmentTitle = assignmentTitle;
        }

        public Integer getMaxMarks() {
            return maxMarks;
        }

        public void setMaxMarks(Integer maxMarks) {
            this.maxMarks = maxMarks;
        }

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public String getStudentName() {
            return studentName;
        }

        public void setStudentName(String studentName) {
            this.studentName = studentName;
        }

        public String getStudentEmail() {
            return studentEmail;
        }

        public void setStudentEmail(String studentEmail) {
            this.studentEmail = studentEmail;
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

        public String getSubmissionText() {
            return submissionText;
        }

        public void setSubmissionText(String submissionText) {
            this.submissionText = submissionText;
        }
    }
}
