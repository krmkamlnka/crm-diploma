package kz.attractorschool.backend.student;

import kz.attractorschool.backend.course.Course;
import kz.attractorschool.backend.course.CourseRepository;
import kz.attractorschool.backend.shared.exception.BadRequestException;
import kz.attractorschool.backend.shared.exception.ConflictException;
import kz.attractorschool.backend.shared.exception.ForbiddenException;
import kz.attractorschool.backend.shared.exception.ResourceNotFoundException;
import kz.attractorschool.backend.student.dto.EnrollStudentRequest;
import kz.attractorschool.backend.student.dto.StudentPerformanceResponse;
import kz.attractorschool.backend.student.dto.StudentResponse;
import kz.attractorschool.backend.user.User;
import kz.attractorschool.backend.user.UserRepository;
import kz.attractorschool.backend.user.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public List<StudentResponse> enrollStudent(UUID userId, EnrollStudentRequest request) {
        log.info("Enrolling user {} in courses {}", userId, request.getCourseIds());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != UserRole.STUDENT) {
            throw new BadRequestException("Only users with STUDENT role can be enrolled in courses");
        }

        if (request.getCourseIds() == null || request.getCourseIds().isEmpty()) {
            throw new BadRequestException("At least one course ID is required");
        }

        List<StudentResponse> enrollments = new ArrayList<>();

        for (UUID courseId : request.getCourseIds()) {
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

            if (studentRepository.existsByUserIdAndCourseId(userId, courseId)) {
                throw new ConflictException("Student is already enrolled in course: " + course.getName());
            }

            Student student = Student.builder()
                    .user(user)
                    .course(course)
                    .averageGrade(null)
                    .attendanceRate(0.0)
                    .homeworkCompletionRate(0.0)
                    .build();

            student = studentRepository.save(student);

            // Update course enrolled students count
            course.setEnrolledStudents((course.getEnrolledStudents() != null ? course.getEnrolledStudents() : 0) + 1);
            courseRepository.save(course);

            enrollments.add(mapToResponse(student));
            log.info("User {} enrolled in course {} successfully", userId, courseId);
        }

        return enrollments;
    }

    @Transactional(readOnly = true)
    public Page<StudentResponse> getStudentsByInstructor(UUID instructorId, UUID courseId, Pageable pageable) {
        log.info("Fetching students for instructor {} (courseId: {})", instructorId, courseId);

        if (!userRepository.existsById(instructorId)) {
            throw new ResourceNotFoundException("Instructor not found");
        }

        Page<Student> students;
        if (courseId != null) {
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

            if (!course.getInstructor().getId().equals(instructorId)) {
                throw new ForbiddenException("You do not have access to this course");
            }

            students = studentRepository.findAllByInstructorIdAndCourseId(instructorId, courseId, pageable);
        } else {
            students = studentRepository.findAllByInstructorId(instructorId, pageable);
        }

        return students.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public StudentPerformanceResponse getStudentDetails(UUID studentId, UUID requestingUserId) {
        log.info("Fetching student details {} for user {}", studentId, requestingUserId);

        Student student = studentRepository.findByIdWithDetails(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student enrollment not found"));

        User requestingUser = userRepository.findById(requestingUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check permissions: admin, super_admin, instructor of the course, or the student themselves
        boolean hasAccess = requestingUser.getRole() == UserRole.ADMIN
                || requestingUser.getRole() == UserRole.SUPER_ADMIN
                || student.getCourse().getInstructor().getId().equals(requestingUserId)
                || student.getUser().getId().equals(requestingUserId);

        if (!hasAccess) {
            throw new ForbiddenException("You do not have access to this student's details");
        }

        return mapToPerformanceResponse(student);
    }

    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .firstName(student.getUser().getFirstName())
                .lastName(student.getUser().getLastName())
                .email(student.getUser().getEmail())
                .profilePhotoUrl(student.getUser().getProfilePhotoUrl())
                .courseId(student.getCourse().getId())
                .courseName(student.getCourse().getName())
                .averageGrade(student.getAverageGrade())
                .attendanceRate(student.getAttendanceRate())
                .homeworkCompletionRate(student.getHomeworkCompletionRate())
                .enrolledAt(student.getEnrolledAt())
                .build();
    }

    private StudentPerformanceResponse mapToPerformanceResponse(Student student) {
        // TODO: Add lesson-by-lesson performance when Lesson, Homework, Attendance modules are implemented
        return StudentPerformanceResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .firstName(student.getUser().getFirstName())
                .lastName(student.getUser().getLastName())
                .email(student.getUser().getEmail())
                .profilePhotoUrl(student.getUser().getProfilePhotoUrl())
                .courseId(student.getCourse().getId())
                .courseName(student.getCourse().getName())
                .averageGrade(student.getAverageGrade())
                .attendanceRate(student.getAttendanceRate())
                .homeworkCompletionRate(student.getHomeworkCompletionRate())
                .enrolledAt(student.getEnrolledAt())
                .performance(new ArrayList<>()) // Empty for now, will be populated later
                .build();
    }
}
