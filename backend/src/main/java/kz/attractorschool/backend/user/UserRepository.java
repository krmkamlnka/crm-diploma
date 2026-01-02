package kz.attractorschool.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository для работы с пользователями
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Найти пользователя по email
     * @param email Email пользователя
     * @return Optional с пользователем если найден
     */
    Optional<User> findByEmail(String email);

    /**
     * Проверить существование пользователя по email
     * @param email Email пользователя
     * @return true если пользователь существует
     */
    boolean existsByEmail(String email);

    /**
     * Найти пользователя по токену верификации email
     * @param token Токен верификации
     * @return Optional с пользователем если найден
     */
    Optional<User> findByEmailVerificationToken(String token);
}
