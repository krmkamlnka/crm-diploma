package kz.attractorschool.backend.notification;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class NotificationResponse {
    private UUID id;
    private String type;
    private String title;
    private String body;
    private boolean isRead;
    private LocalDateTime createdAt;
}
