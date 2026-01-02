package kz.attractorschool.backend.invitation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository для работы с приглашениями
 */
@Repository
public interface InvitationRepository extends JpaRepository<Invitation, UUID> {

    /**
     * Найти приглашение по токену
     */
    Optional<Invitation> findByToken(String token);

    /**
     * Проверить существование активного приглашения для email
     */
    boolean existsByEmailAndIsUsedFalse(String email);
}
