package kz.attractorschool.backend.payment;

import kz.attractorschool.backend.notification.NotificationService;
import kz.attractorschool.backend.payment.dto.AdminPaymentPageResponse;
import kz.attractorschool.backend.payment.dto.AdminPaymentResponse;
import kz.attractorschool.backend.payment.dto.MarkPaidRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminPaymentService {

    private final StudentPaymentRepository paymentRepository;
    private final NotificationService notificationService;

    public AdminPaymentPageResponse getPayments(UUID courseId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<StudentPayment> result = courseId != null
                ? paymentRepository.findAllByCourseIdWithDetails(courseId, pageable)
                : paymentRepository.findAllWithDetails(pageable);

        return AdminPaymentPageResponse.builder()
                .content(result.getContent().stream().map(this::toAdminPaymentResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @Transactional
    public AdminPaymentResponse markPaid(UUID paymentId, MarkPaidRequest request) {
        StudentPayment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Платёж не найден"));

        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaidAt(request.getPaidAt() != null ? request.getPaidAt() : LocalDateTime.now());
        payment.setNote(request.getNote());

        StudentPayment saved = paymentRepository.save(payment);

        String period = buildPeriodLabel(saved.getPeriodMonth(), saved.getPeriodYear());
        notificationService.notifyPaymentMarkedPaid(saved.getStudent(), saved.getCourse().getName(), period);

        return toAdminPaymentResponse(saved);
    }

    @Transactional
    public AdminPaymentResponse markUnpaid(UUID paymentId) {
        StudentPayment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Платёж не найден"));

        payment.setStatus(PaymentStatus.PENDING);
        payment.setPaidAt(null);
        payment.setNote(null);

        return toAdminPaymentResponse(paymentRepository.save(payment));
    }

    private static final String[] MONTH_NAMES = {
        "", "январь", "февраль", "март", "апрель", "май", "июнь",
        "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
    };

    private String buildPeriodLabel(Integer month, Integer year) {
        if (month != null && year != null && month >= 1 && month <= 12) {
            return MONTH_NAMES[month] + " " + year;
        }
        return year != null ? String.valueOf(year) : "";
    }

    private AdminPaymentResponse toAdminPaymentResponse(StudentPayment p) {
        return AdminPaymentResponse.builder()
                .id(p.getId())
                .studentId(p.getStudent().getId())
                .studentFirstName(p.getStudent().getFirstName())
                .studentLastName(p.getStudent().getLastName())
                .studentEmail(p.getStudent().getEmail())
                .courseId(p.getCourse().getId())
                .courseName(p.getCourse().getName())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .status(p.getStatus().name())
                .dueDate(p.getDueDate())
                .paidAt(p.getPaidAt())
                .periodMonth(p.getPeriodMonth())
                .periodYear(p.getPeriodYear())
                .note(p.getNote())
                .build();
    }
}
