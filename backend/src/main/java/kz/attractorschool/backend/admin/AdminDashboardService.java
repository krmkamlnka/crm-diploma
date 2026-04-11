package kz.attractorschool.backend.admin;

import kz.attractorschool.backend.admin.dto.AdminDashboardResponse;
import kz.attractorschool.backend.course.CourseRepository;
import kz.attractorschool.backend.payment.PaymentStatus;
import kz.attractorschool.backend.payment.StudentPaymentRepository;
import kz.attractorschool.backend.user.UserRepository;
import kz.attractorschool.backend.user.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final StudentPaymentRepository paymentRepository;

    public AdminDashboardResponse getDashboardStats() {
        // --- Stat cards ---
        long totalUsers = userRepository.count();

        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime now = LocalDateTime.now();
        long newThisMonth = userRepository.countNewRegistrationsBetween(monthStart, now);

        long activeCourses = courseRepository.count();

        int growthPercent = totalUsers > 0
                ? (int) Math.round((double) newThisMonth / totalUsers * 100)
                : 0;

        // --- Progress bars ---
        long activeUsers = userRepository.countByStatus(UserStatus.ACTIVE);
        int activeUsersPercent = totalUsers > 0
                ? (int) Math.round((double) activeUsers / totalUsers * 100)
                : 0;

        // Course fill: average enrolledStudents / 20 (assume max 20 per course)
        int courseFillPercent = computeCourseFillPercent();

        long totalPayments = paymentRepository.count();
        long paidPayments = paymentRepository.countByStatus(PaymentStatus.COMPLETED);
        int paidInvoicesPercent = totalPayments > 0
                ? (int) Math.round((double) paidPayments / totalPayments * 100)
                : 0;

        // --- Recent registrations ---
        List<AdminDashboardResponse.RecentUserDto> recent = userRepository.findTop5RecentNonAdmins()
                .stream()
                .map(u -> AdminDashboardResponse.RecentUserDto.builder()
                        .id(u.getId().toString())
                        .firstName(u.getFirstName())
                        .lastName(u.getLastName())
                        .email(u.getEmail())
                        .role(u.getRole().name())
                        .profilePhotoUrl(u.getProfilePhotoUrl())
                        .build())
                .toList();

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .newRegistrationsThisMonth(newThisMonth)
                .activeCourses(activeCourses)
                .growthPercent(growthPercent)
                .activeUsersPercent(activeUsersPercent)
                .courseFillPercent(courseFillPercent)
                .paidInvoicesPercent(paidInvoicesPercent)
                .recentRegistrations(recent)
                .build();
    }

    private int computeCourseFillPercent() {
        var courses = courseRepository.findAll();
        if (courses.isEmpty()) return 0;
        int totalEnrolled = courses.stream()
                .mapToInt(c -> c.getEnrolledStudents() != null ? c.getEnrolledStudents() : 0)
                .sum();
        // Use totalLessons as proxy for "capacity" — fallback: assume 20 seats per course
        int totalCapacity = courses.size() * 20;
        return Math.min(100, (int) Math.round((double) totalEnrolled / totalCapacity * 100));
    }
}
