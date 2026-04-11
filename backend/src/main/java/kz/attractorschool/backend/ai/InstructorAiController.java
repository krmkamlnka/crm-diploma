package kz.attractorschool.backend.ai;

import jakarta.validation.Valid;
import kz.attractorschool.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/instructor/ai")
@RequiredArgsConstructor
public class InstructorAiController {

    private final GeminiService geminiService;

    /**
     * POST /api/v1/instructor/ai/chat?courseId={id}
     * Отправить сообщение AI-ассистенту с контекстом курса и успеваемости студентов
     */
    @PostMapping("/chat")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<AiChatResponse> chat(
            @RequestParam UUID courseId,
            @Valid @RequestBody AiChatRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        log.info("POST /api/v1/instructor/ai/chat - courseId={} instructor={}", courseId, userDetails.getId());

        String reply = geminiService.chatInstructor(userDetails.getId(), courseId, request.getMessage());
        return ResponseEntity.ok(new AiChatResponse(reply));
    }
}
