package kz.attractorschool.backend.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminDashboardResponse {

    // Stat cards
    private long totalUsers;
    private long newRegistrationsThisMonth;
    private long activeCourses;
    private int growthPercent;

    // Progress bars
    private int activeUsersPercent;
    private int courseFillPercent;
    private int paidInvoicesPercent;

    // Recent registrations
    private List<RecentUserDto> recentRegistrations;

    @Data
    @Builder
    public static class RecentUserDto {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String role;
        private String profilePhotoUrl;
    }
}
