package kz.attractorschool.backend.auth.dto;

import kz.attractorschool.backend.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO для ответа при успешной аутентификации
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    /**
     * Access токен (короткоживущий, 15 минут)
     */
    private String accessToken;

    /**
     * Refresh токен (долгоживущий, 7 дней)
     */
    private String refreshToken;

    /**
     * Тип токена (всегда "Bearer")
     */
    @Builder.Default
    private String tokenType = "Bearer";

    /**
     * ID пользователя
     */
    private UUID userId;

    /**
     * Email пользователя
     */
    private String email;

    /**
     * Полное имя пользователя
     */
    private String fullName;

    /**
     * Роль пользователя
     */
    private UserRole role;

    /**
     * Статус верификации email
     */
    private Boolean isEmailVerified;
}
