package kz.attractorschool.backend.payment;

import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentStatus {
    PENDING, COMPLETED, FAILED, CANCELLED;

    @JsonValue
    public String getValue() {
        return this.name();
    }
}
