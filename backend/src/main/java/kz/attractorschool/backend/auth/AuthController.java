package kz.attractorschool.backend.auth;

import jakarta.validation.Valid;
import kz.attractorschool.backend.auth.dto.AuthResponse;
import kz.attractorschool.backend.auth.dto.LoginRequest;
import kz.attractorschool.backend.auth.dto.RefreshTokenRequest;
import kz.attractorschool.backend.auth.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST контроллер для аутентификации и регистрации
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Регистрация нового пользователя
     *
     * @param request Данные для регистрации
     * @return AuthResponse с токенами
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/v1/auth/register - регистрация пользователя: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Вход в систему
     *
     * @param request Данные для входа
     * @return AuthResponse с токенами
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/v1/auth/login - вход пользователя: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Обновление токенов через refresh token
     *
     * @param request Refresh token
     * @return AuthResponse с новыми токенами
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("POST /api/v1/auth/refresh - обновление токенов");
        AuthResponse response = authService.refresh(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Выход из системы
     * В текущей реализации просто возвращает успешный ответ
     * Фронтенд должен удалить токены на своей стороне
     *
     * @return Сообщение об успешном выходе
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        log.info("POST /api/v1/auth/logout - выход из системы");
        // TODO: Добавить токен в черный список (blacklist) в Redis
        return ResponseEntity.ok(Map.of("message", "Успешный выход из системы"));
    }

    /**
     * Верификация email по токену
     *
     * @param token Токен верификации
     * @return Сообщение об успешной верификации
     */
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {
        log.info("POST /api/v1/auth/verify-email - верификация email");
        authService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Email успешно верифицирован"));
    }
}
