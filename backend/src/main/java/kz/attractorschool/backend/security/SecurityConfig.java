package kz.attractorschool.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Конфигурация Spring Security
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Настройка цепочки фильтров безопасности
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Отключаем CSRF для REST API (stateless)
                .csrf(AbstractHttpConfigurer::disable)

                // Отключаем CORS (настроим отдельно если нужно)
                .cors(AbstractHttpConfigurer::disable)

                // Настройка сессий - stateless (без сессий)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Настройка авторизации запросов
                .authorizeHttpRequests(auth -> auth
                        // Публичные endpoints (не требуют авторизации)
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/api/v1/webhooks/**",
                                "/error",
                                "/actuator/health"
                        ).permitAll()

                        // Все остальные запросы требуют аутентификации
                        .anyRequest().authenticated()
                )

                // Добавить JWT фильтр перед UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Bean для хеширования паролей
     * Strength factor = 10 (достаточно безопасно, но не слишком медленно)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
