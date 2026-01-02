package kz.attractorschool.backend.auth;

import kz.attractorschool.backend.auth.dto.AuthResponse;
import kz.attractorschool.backend.auth.dto.LoginRequest;
import kz.attractorschool.backend.auth.dto.RefreshTokenRequest;
import kz.attractorschool.backend.auth.dto.RegisterRequest;
import kz.attractorschool.backend.security.JwtTokenProvider;
import kz.attractorschool.backend.shared.email.EmailService;
import kz.attractorschool.backend.user.User;
import kz.attractorschool.backend.user.UserRepository;
import kz.attractorschool.backend.user.UserRole;
import kz.attractorschool.backend.user.UserStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Сервис для аутентификации и регистрации пользователей
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    /**
     * Регистрация нового пользователя
     *
     * @param request Данные для регистрации
     * @return AuthResponse с токенами
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Регистрация нового пользователя: {}", request.getEmail());

        // Проверка существования пользователя
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        // Создание нового пользователя
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : UserRole.STUDENT)
                .status(UserStatus.ACTIVE)
                .isEmailVerified(false)
                .emailVerificationToken(UUID.randomUUID().toString())
                .emailVerificationTokenExpiresAt(LocalDateTime.now().plusHours(24))
                .build();

        user = userRepository.save(user);
        log.info("Пользователь успешно зарегистрирован с ID: {}", user.getId());

        // Отправить email с токеном верификации
        emailService.sendVerificationEmail(
                user.getEmail(),
                user.getFirstName(),
                user.getEmailVerificationToken()
        );
        log.info("Email верификации отправлен на: {}", user.getEmail());

        // Генерация токенов
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    /**
     * Вход в систему
     *
     * @param request Данные для входа
     * @return AuthResponse с токенами
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Попытка входа пользователя: {}", request.getEmail());

        // Поиск пользователя
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Неверный email или пароль"));

        // Проверка пароля
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Неверный email или пароль");
        }

        // Проверка статуса пользователя
        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new RuntimeException("Аккаунт деактивирован");
        }

        log.info("Пользователь успешно вошел: {}", user.getEmail());

        // Генерация токенов
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    /**
     * Обновление токенов через refresh token
     *
     * @param request Refresh token
     * @return AuthResponse с новыми токенами
     */
    @Transactional(readOnly = true)
    public AuthResponse refresh(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        // Валидация refresh токена
        if (!jwtTokenProvider.validateRefreshToken(refreshToken)) {
            throw new RuntimeException("Невалидный refresh token");
        }

        // Извлечение ID пользователя из токена
        UUID userId = jwtTokenProvider.getUserIdFromRefreshToken(refreshToken);

        // Поиск пользователя
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Проверка статуса пользователя
        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new RuntimeException("Аккаунт деактивирован");
        }

        log.info("Токены обновлены для пользователя: {}", user.getEmail());

        // Генерация новых токенов
        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);

        return buildAuthResponse(user, newAccessToken, newRefreshToken);
    }

    /**
     * Верификация email пользователя
     *
     * @param token Токен верификации
     */
    @Transactional
    public void verifyEmail(String token) {
        log.info("Верификация email по токену: {}", token);

        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Невалидный токен верификации"));

        // Проверка срока действия токена
        if (user.getEmailVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Токен верификации истек");
        }

        // Верификация email
        user.setIsEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiresAt(null);
        userRepository.save(user);

        log.info("Email успешно верифицирован для пользователя: {}", user.getEmail());
    }

    /**
     * Построение ответа AuthResponse
     */
    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .role(user.getRole())
                .isEmailVerified(user.getIsEmailVerified())
                .build();
    }
}
