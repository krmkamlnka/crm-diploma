package kz.attractorschool.backend.submission;

import kz.attractorschool.backend.homework.Homework;
import kz.attractorschool.backend.homework.HomeworkRepository;
import kz.attractorschool.backend.shared.exception.BadRequestException;
import kz.attractorschool.backend.shared.exception.ConflictException;
import kz.attractorschool.backend.shared.exception.ForbiddenException;
import kz.attractorschool.backend.shared.exception.ResourceNotFoundException;
import kz.attractorschool.backend.submission.dto.*;
import kz.attractorschool.backend.user.User;
import kz.attractorschool.backend.user.UserRepository;
import kz.attractorschool.backend.user.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HomeworkSubmissionService {

    private final HomeworkSubmissionRepository submissionRepository;
    private final HomeworkRepository homeworkRepository;
    private final UserRepository userRepository;

    @Transactional
    public SubmissionResponse submitHomework(UUID homeworkId, SubmitHomeworkRequest request, UUID studentId) {
        log.info("Student {} submitting homework {}", studentId, homeworkId);

        Homework homework = homeworkRepository.findByIdWithLessonAndCourse(homeworkId)
                .orElseThrow(() -> new ResourceNotFoundException("Homework not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Валидация: только студенты могут сдавать ДЗ
        if (student.getRole() != UserRole.STUDENT) {
            throw new ForbiddenException("Only students can submit homework");
        }

        // Проверка: студент уже сдал это ДЗ
        if (submissionRepository.existsByHomeworkIdAndStudentId(homeworkId, studentId)) {
            throw new ConflictException("You have already submitted this homework");
        }

        // TODO: Проверить что студент записан на курс

        // Определить isLate
        LocalDateTime now = LocalDateTime.now();
        boolean isLate = now.isAfter(homework.getDueDate());

        HomeworkSubmission submission = HomeworkSubmission.builder()
                .homework(homework)
                .student(student)
                .githubUrl(request.getGithubUrl())
                .isLate(isLate)
                .build();

        submission = submissionRepository.save(submission);
        log.info("Homework submission {} created successfully", submission.getId());

        return mapToResponse(submission);
    }

    @Transactional(readOnly = true)
    public SubmissionListResponse getHomeworkSubmissions(UUID homeworkId, UUID instructorId) {
        log.info("Fetching submissions for homework {} by instructor {}", homeworkId, instructorId);

        Homework homework = homeworkRepository.findByIdWithLessonAndCourse(homeworkId)
                .orElseThrow(() -> new ResourceNotFoundException("Homework not found"));

        validateInstructorAccess(homework, instructorId);

        List<HomeworkSubmission> submissions = submissionRepository.findByHomeworkId(homeworkId);

        SubmissionListResponse.HomeworkInfo homeworkInfo = SubmissionListResponse.HomeworkInfo.builder()
                .id(homework.getId())
                .title(homework.getTitle())
                .deadline(homework.getDueDate())
                .build();

        List<SubmissionListResponse.SubmissionWithStudent> submissionList = submissions.stream()
                .map(this::mapToSubmissionWithStudent)
                .collect(Collectors.toList());

        return SubmissionListResponse.builder()
                .homework(homeworkInfo)
                .submissions(submissionList)
                .build();
    }

    @Transactional
    public SubmissionResponse gradeSubmission(UUID submissionId, GradeSubmissionRequest request, UUID instructorId) {
        log.info("Grading submission {} by instructor {}", submissionId, instructorId);

        HomeworkSubmission submission = submissionRepository.findByIdWithHomeworkAndLesson(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        validateInstructorAccess(submission.getHomework(), instructorId);

        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getGrade() != null) {
            if (request.getGrade() < 0 || request.getGrade() > 100) {
                throw new BadRequestException("Grade must be between 0 and 100");
            }
            submission.setGrade(request.getGrade());
            submission.setGradedAt(LocalDateTime.now());
            submission.setGradedBy(instructor);
        }

        if (request.getFeedback() != null) {
            submission.setFeedback(request.getFeedback());
        }

        submission = submissionRepository.save(submission);
        log.info("Submission {} graded successfully", submissionId);

        return mapToResponse(submission);
    }

    private void validateInstructorAccess(Homework homework, UUID instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UUID courseInstructorId = homework.getLesson().getCourse().getInstructor().getId();

        if (instructor.getRole() != UserRole.ADMIN
                && instructor.getRole() != UserRole.SUPER_ADMIN
                && !courseInstructorId.equals(instructorId)) {
            throw new ForbiddenException("You do not have permission to access these submissions");
        }
    }

    private SubmissionResponse mapToResponse(HomeworkSubmission submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .homeworkId(submission.getHomework().getId())
                .studentId(submission.getStudent().getId())
                .githubUrl(submission.getGithubUrl())
                .submittedAt(submission.getSubmittedAt())
                .isLate(submission.getIsLate())
                .grade(submission.getGrade())
                .feedback(submission.getFeedback())
                .gradedAt(submission.getGradedAt())
                .gradedBy(submission.getGradedBy() != null ? submission.getGradedBy().getId() : null)
                .updatedAt(submission.getUpdatedAt())
                .build();
    }

    private SubmissionListResponse.SubmissionWithStudent mapToSubmissionWithStudent(HomeworkSubmission submission) {
        User student = submission.getStudent();

        SubmissionListResponse.StudentInfo studentInfo = SubmissionListResponse.StudentInfo.builder()
                .id(student.getId())
                .userId(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .build();

        return SubmissionListResponse.SubmissionWithStudent.builder()
                .id(submission.getId())
                .homeworkId(submission.getHomework().getId())
                .student(studentInfo)
                .githubUrl(submission.getGithubUrl())
                .submittedAt(submission.getSubmittedAt())
                .isLate(submission.getIsLate())
                .grade(submission.getGrade())
                .feedback(submission.getFeedback())
                .gradedAt(submission.getGradedAt())
                .gradedBy(submission.getGradedBy() != null ? submission.getGradedBy().getId() : null)
                .build();
    }
}
