package com.lms.openlms.dto;

public class CourseDto {

    public static class CreateCourseRequest {
        private String courseName;
        private String courseCode;
        private Long professorId;
        private String description;

        public CreateCourseRequest() {}

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

        public Long getProfessorId() {
            return professorId;
        }

        public void setProfessorId(Long professorId) {
            this.professorId = professorId;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class CourseResponse {
        private Long courseId;
        private String courseName;
        private String courseCode;
        private Long professorId;
        private String professorName;
        private String professorEmail;
        private Long enrolledStudentsCount;
        private String description;

        public CourseResponse() {}

        public Long getCourseId() {
            return courseId;
        }

        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }

        public Long getId() {
            return courseId;
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

        public Long getProfessorId() {
            return professorId;
        }

        public void setProfessorId(Long professorId) {
            this.professorId = professorId;
        }

        public String getProfessorName() {
            return professorName;
        }

        public void setProfessorName(String professorName) {
            this.professorName = professorName;
        }

        public String getProfessorEmail() {
            return professorEmail;
        }

        public void setProfessorEmail(String professorEmail) {
            this.professorEmail = professorEmail;
        }

        public Long getEnrolledStudentsCount() {
            return enrolledStudentsCount;
        }

        public void setEnrolledStudentsCount(Long enrolledStudentsCount) {
            this.enrolledStudentsCount = enrolledStudentsCount;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class EnrollRequest {
        private Long studentId;
        private String courseCode;

        public EnrollRequest() {}

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public String getCourseCode() {
            return courseCode;
        }

        public void setCourseCode(String courseCode) {
            this.courseCode = courseCode;
        }
    }
}
