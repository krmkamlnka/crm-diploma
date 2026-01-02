package kz.attractorschool.backend.invitation;

import jakarta.validation.Valid;
import kz.attractorschool.backend.invitation.dto.CreateInvitationRequest;
import kz.attractorschool.backend.invitation.dto.InvitationResponse;
import kz.attractorschool.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Контроллер для управления приглашениями
 * Доступно только для администраторов
 */
@RestController
@RequestMapping("/api/v1/admin/invitations")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
public class InvitationController {

    private final InvitationService invitationService;

    /**
     * Создать новое приглашение
     * POST /api/v1/admin/invitations
     */
    @PostMapping
    public ResponseEntity<InvitationResponse> createInvitation(
            @Valid @RequestBody CreateInvitationRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        log.info("POST /api/v1/admin/invitations - Creating invitation for: {} by user: {}",
                request.getEmail(), currentUser.getEmail());

        // Получить ID текущего аутентифицированного пользователя
        UUID currentUserId = currentUser.getId();

        InvitationResponse response = invitationService.createInvitation(request, currentUserId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Получить список всех приглашений
     * GET /api/v1/admin/invitations
     */
    @GetMapping
    public ResponseEntity<List<InvitationResponse>> getAllInvitations() {
        log.info("GET /api/v1/admin/invitations - Fetching all invitations");

        List<InvitationResponse> invitations = invitationService.getAllInvitations();

        return ResponseEntity.ok(invitations);
    }

    /**
     * Удалить приглашение
     * DELETE /api/v1/admin/invitations/:id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvitation(@PathVariable UUID id) {
        log.info("DELETE /api/v1/admin/invitations/{} - Deleting invitation", id);

        invitationService.deleteInvitation(id);

        return ResponseEntity.noContent().build();
    }
}
