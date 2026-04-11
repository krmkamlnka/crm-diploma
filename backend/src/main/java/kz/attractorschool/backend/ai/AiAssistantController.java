package kz.attractorschool.backend.ai;

import jakarta.validation.Valid;
import kz.attractorschool.backend.security.CustomUserDetails;
import kz.attractorschool.backend.student.StudentRepository;
import kz.attractorschool.backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/student/ai")
@RequiredArgsConstructor
public class AiAssistantController {

    private final GeminiService geminiService;
    private final StudentRepository studentRepository;

    /**
     * POST /api/v1/student/ai/chat?enrollmentId={id}
     * Отправить сообщение AI-ассистенту с контекстом конкретного курса
     */
    @PostMapping("/chat")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AiChatResponse> chat(
            @RequestParam UUID enrollmentId,
            @Valid @RequestBody AiChatRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        log.info("POST /api/v1/student/ai/chat - enrollmentId={} user={}", enrollmentId, userDetails.getId());

        // Проверяем, что enrollment принадлежит этому студенту
        boolean owns = studentRepository.findById(enrollmentId)
                .map(s -> s.getUser().getId().equals(userDetails.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        if (!owns) {
            return ResponseEntity.status(403).build();
        }

        String reply = geminiService.chat(userDetails.getId(), enrollmentId, request.getMessage());
        return ResponseEntity.ok(new AiChatResponse(reply));
    }
}
