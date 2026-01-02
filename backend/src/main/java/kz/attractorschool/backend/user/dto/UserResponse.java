package kz.attractorschool.backend.user.dto;

import kz.attractorschool.backend.user.UserRole;
import kz.attractorschool.backend.user.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO для возврата информации о пользователе
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private String phone;
    private String profilePhotoUrl;
    private UserStatus status;
    private Boolean isEmailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
