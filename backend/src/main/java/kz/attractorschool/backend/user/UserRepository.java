package kz.attractorschool.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByEmailVerificationToken(String token);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByStatus(UserStatus status);

    @Query("SELECT u FROM User u WHERE u.role NOT IN ('SUPER_ADMIN', 'ADMIN') ORDER BY u.createdAt DESC LIMIT 5")
    List<User> findTop5RecentNonAdmins();

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN :start AND :end AND u.role NOT IN ('SUPER_ADMIN', 'ADMIN')")
    long countNewRegistrationsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT u FROM User u WHERE u.role IN ('ADMIN', 'SUPER_ADMIN')")
    List<User> findAllAdmins();
}
