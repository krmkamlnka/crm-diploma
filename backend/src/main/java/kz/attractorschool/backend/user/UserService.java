package kz.attractorschool.backend.user;

import kz.attractorschool.backend.shared.storage.FileStorageService;
import kz.attractorschool.backend.user.dto.ChangePasswordRequest;
import kz.attractorschool.backend.user.dto.UpdateUserRequest;
import kz.attractorschool.backend.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

/**
 * Сервис для управления пользователями
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    /**
     * Получить всех пользователей с пагинацией
     */
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        log.info("Fetching all users with pagination: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());

        return userRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    /**
     * Получить пользователя по ID
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {
        log.info("Fetching user by ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден с ID: " + userId));

        return mapToResponse(user);
    }

    /**
     * Обновить информацию о пользователе
     */
    @Transactional
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        log.info("Updating user with ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден с ID: " + userId));

        // Обновить только переданные поля
        if (request.getEmail() != null) {
            // Проверить уникальность email
            if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email уже используется: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getProfilePhotoUrl() != null) {
            user.setProfilePhotoUrl(request.getProfilePhotoUrl());
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        user = userRepository.save(user);
        log.info("User updated successfully: {}", userId);

        return mapToResponse(user);
    }

    /**
     * Изменить статус пользователя (активировать/деактивировать)
     */
    @Transactional
    public UserResponse changeUserStatus(UUID userId, UserStatus newStatus) {
        log.info("Changing user status for ID: {} to {}", userId, newStatus);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден с ID: " + userId));

        user.setStatus(newStatus);
        user = userRepository.save(user);

        log.info("User status changed successfully: {} -> {}", userId, newStatus);
        return mapToResponse(user);
    }

    /**
     * Изменить пароль пользователя
     */
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        log.info("Changing password for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден с ID: " + userId));

        // Проверить текущий пароль
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Неверный текущий пароль");
        }

        // Установить новый пароль
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user ID: {}", userId);
    }

    /**
     * Загрузить фото профиля пользователя
     */
    @Transactional
    public UserResponse uploadProfilePhoto(UUID userId, MultipartFile file) {
        log.info("Uploading profile photo for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден с ID: " + userId));

        // Удалить старое фото если есть
        if (user.getProfilePhotoUrl() != null && !user.getProfilePhotoUrl().isEmpty()) {
            try {
                fileStorageService.deleteFile(user.getProfilePhotoUrl());
            } catch (Exception e) {
                log.warn("Failed to delete old profile photo: {}", e.getMessage());
            }
        }

        // Загрузить новое фото
        String photoUrl = fileStorageService.uploadProfilePhoto(file, userId);
        user.setProfilePhotoUrl(photoUrl);
        user = userRepository.save(user);

        log.info("Profile photo uploaded successfully for user ID: {}", userId);
        return mapToResponse(user);
    }

    /**
     * Удалить фото профиля пользователя
     */
    @Transactional
    public UserResponse deleteProfilePhoto(UUID userId) {
        log.info("Deleting profile photo for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден с ID: " + userId));

        if (user.getProfilePhotoUrl() != null && !user.getProfilePhotoUrl().isEmpty()) {
            fileStorageService.deleteFile(user.getProfilePhotoUrl());
            user.setProfilePhotoUrl(null);
            user = userRepository.save(user);
            log.info("Profile photo deleted successfully for user ID: {}", userId);
        } else {
            log.info("No profile photo to delete for user ID: {}", userId);
        }

        return mapToResponse(user);
    }

    /**
     * Удалить пользователя
     */
    @Transactional
    public void deleteUser(UUID userId) {
        log.info("Deleting user with ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден с ID: " + userId));

        // Удалить фото профиля если есть
        if (user.getProfilePhotoUrl() != null && !user.getProfilePhotoUrl().isEmpty()) {
            try {
                fileStorageService.deleteFile(user.getProfilePhotoUrl());
            } catch (Exception e) {
                log.warn("Failed to delete profile photo during user deletion: {}", e.getMessage());
            }
        }

        userRepository.deleteById(userId);
        log.info("User deleted successfully: {}", userId);
    }

    /**
     * Маппинг User -> UserResponse
     */
    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .phone(user.getPhone())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .status(user.getStatus())
                .isEmailVerified(user.getIsEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
