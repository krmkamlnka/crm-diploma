package kz.attractorschool.backend.shared.seeder;

import kz.attractorschool.backend.user.User;
import kz.attractorschool.backend.user.UserRepository;
import kz.attractorschool.backend.user.UserRole;
import kz.attractorschool.backend.user.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Компонент для создания начальных данных в БД
 * Запускается автоматически при старте приложения
 */
@Component
@Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Running DataSeeder...");
        seedSuperAdmin();
    }

    /**
     * Создать SUPER_ADMIN пользователя если его нет
     */
    private void seedSuperAdmin() {
        // Проверка: существует ли уже SUPER_ADMIN
        boolean superAdminExists = userRepository.findAll().stream()
                .anyMatch(user -> user.getRole() == UserRole.SUPER_ADMIN);

        if (superAdminExists) {
            log.info("SUPER_ADMIN user already exists, skipping seed");
            return;
        }

        // Создание SUPER_ADMIN
        User superAdmin = User.builder()
                .email("admin@crmlms.kz")
                .passwordHash(passwordEncoder.encode("Admin123!"))
                .firstName("Супер")
                .lastName("Админ")
                .role(UserRole.SUPER_ADMIN)
                .status(UserStatus.ACTIVE)
                .isEmailVerified(true) // SUPER_ADMIN автоматически верифицирован
                .build();

        userRepository.save(superAdmin);
        log.info("✅ SUPER_ADMIN user created successfully!");
        log.info("   Email: admin@crmlms.kz");
        log.info("   Password: Admin123!");
        log.info("   ⚠️  Пожалуйста, смените пароль после первого входа!");
    }
}

/**
 * Компонент для создания тестовых данных (только в dev профиле)
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
class DevDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Running DevDataSeeder (dev profile only)...");
        seedTestUsers();
    }

    /**
     * Создать тестовых пользователей для всех ролей
     */
    private void seedTestUsers() {
        // Проверка: если есть более 1 пользователя, пропустить seed
        if (userRepository.count() > 1) {
            log.info("Test users already exist, skipping dev seed");
            return;
        }

        // Создание тестового ADMIN
        User admin = User.builder()
                .email("test.admin@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .firstName("Тестовый")
                .lastName("Админ")
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .isEmailVerified(true)
                .build();

        // Создание тестового INSTRUCTOR
        User instructor = User.builder()
                .email("test.instructor@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .firstName("Тестовый")
                .lastName("Инструктор")
                .role(UserRole.INSTRUCTOR)
                .status(UserStatus.ACTIVE)
                .isEmailVerified(true)
                .build();

        // Создание тестового STUDENT
        User student = User.builder()
                .email("test.student@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .firstName("Тестовый")
                .lastName("Студент")
                .role(UserRole.STUDENT)
                .status(UserStatus.ACTIVE)
                .isEmailVerified(true)
                .build();

        userRepository.save(admin);
        userRepository.save(instructor);
        userRepository.save(student);

        log.info("✅ Test users created successfully!");
        log.info("   ADMIN: test.admin@example.com / Password123!");
        log.info("   INSTRUCTOR: test.instructor@example.com / Password123!");
        log.info("   STUDENT: test.student@example.com / Password123!");
    }
}
