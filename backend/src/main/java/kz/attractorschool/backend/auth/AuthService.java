package kz.attractorschool.backend.auth;

import kz.attractorschool.backend.auth.dto.AuthResponse;
import kz.attractorschool.backend.auth.dto.LoginRequest;
import kz.attractorschool.backend.auth.dto.RefreshTokenRequest;
import kz.attractorschool.backend.auth.dto.RegisterRequest;
import kz.attractorschool.backend.auth.dto.VerifyEmailRequest;
import kz.attractorschool.backend.security.CustomUserDetails;
import kz.attractorschool.backend.security.JwtTokenProvider;
import kz.attractorschool.backend.shared.email.EmailService;
import kz.attractorschool.backend.user.User;
import kz.attractorschool.backend.user.UserRepository;
import kz.attractorschool.backend.user.UserRole;
import kz.attractorschool.backend.user.UserStatus;
import kz.attractorschool.backend.user.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
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
     * Не возвращает токены, только создает пользователя и отправляет код верификации
     *
     * @param request Данные для регистрации
     * @return Сообщение о необходимости верификации
     */
    @Transactional
    public Map<String, String> register(RegisterRequest request) {
        log.info("Регистрация нового пользователя: {}", request.getEmail());

        // Проверка существования пользователя
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        // Генерация 6-значного кода верификации
        String verificationCode = String.format("%06d", (int)(Math.random() * 1000000));

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
                .emailVerificationToken(verificationCode)
                .emailVerificationTokenExpiresAt(LocalDateTime.now().plusHours(24))
                .build();

        user = userRepository.save(user);
        log.info("Пользователь успешно зарегистрирован с ID: {}", user.getId());

        // Отправить email с кодом верификации
        emailService.sendVerificationEmail(
                user.getEmail(),
                user.getFirstName(),
                user.getEmailVerificationToken()
        );
        log.info("Email верификации отправлен на: {}", user.getEmail());

        return Map.of(
                "email", user.getEmail(),
                "message", "Код верификации отправлен на ваш email"
        );
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
     * Верификация email пользователя по коду
     *
     * @param request Email и код верификации
     * @return AuthResponse с токенами после успешной верификации
     */
    @Transactional
    public AuthResponse verifyEmail(VerifyEmailRequest request) {
        log.info("Верификация email по коду для: {}", request.getEmail());

        // Найти пользователя по email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Проверить, что email еще не верифицирован
        if (user.getIsEmailVerified()) {
            throw new RuntimeException("Email уже верифицирован");
        }

        // Проверить код верификации
        if (!request.getVerificationCode().equals(user.getEmailVerificationToken())) {
            throw new RuntimeException("Неверный код верификации");
        }

        // Проверка срока действия токена
        if (user.getEmailVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Код верификации истек");
        }

        // Верификация email
        user.setIsEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiresAt(null);
        user = userRepository.save(user);

        log.info("Email успешно верифицирован для пользователя: {}", user.getEmail());

        // Генерация токенов для автоматического входа после верификации
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    /**
     * Получить информацию о текущем аутентифицированном пользователе
     *
     * @return UserDTO с информацией о пользователе
     */
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Пользователь не аутентифицирован");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomUserDetails)) {
            throw new RuntimeException("Неверный тип Principal");
        }

        CustomUserDetails userDetails = (CustomUserDetails) principal;
        User user = userDetails.getUser();

        log.info("Получение информации о текущем пользователе: {}", user.getEmail());
        return UserDTO.fromEntity(user);
    }

    /**
     * Построение ответа AuthResponse
     */
    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserDTO.fromEntity(user))
                .build();
    }
}
