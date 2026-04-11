package kz.attractorschool.backend.payment;

import kz.attractorschool.backend.payment.dto.AdminPaymentPageResponse;
import kz.attractorschool.backend.payment.dto.AdminPaymentResponse;
import kz.attractorschool.backend.payment.dto.MarkPaidRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/payments")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminPaymentController {

    private final AdminPaymentService adminPaymentService;

    @GetMapping
    public ResponseEntity<AdminPaymentPageResponse> getPayments(
            @RequestParam(required = false) UUID courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminPaymentService.getPayments(courseId, page, size));
    }

    @PatchMapping("/{paymentId}/mark-paid")
    public ResponseEntity<AdminPaymentResponse> markPaid(
            @PathVariable UUID paymentId,
            @RequestBody(required = false) MarkPaidRequest request) {
        return ResponseEntity.ok(adminPaymentService.markPaid(paymentId, request != null ? request : new MarkPaidRequest()));
    }

    @PatchMapping("/{paymentId}/mark-unpaid")
    public ResponseEntity<AdminPaymentResponse> markUnpaid(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(adminPaymentService.markUnpaid(paymentId));
    }
}
