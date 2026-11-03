package com.techx.intervue.modules.company.events;

import com.techx.intervue.config.AppProperties;
import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import com.techx.intervue.services.interfaces.MailServiceInterface;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class CompanyVerificationMailListener {

    private static final String TEMPLATE = "business-document-reviewed";
    private static final String VERIFICATION_PATH = "/recruiter/company/verification";
    private static final DateTimeFormatter EXPIRY_DATE =
            DateTimeFormatter.ofPattern("d MMM yyyy").withZone(ZoneId.of("Asia/Ho_Chi_Minh"));

    private final MailServiceInterface mailService;
    private final AppProperties appProperties;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onBusinessDocumentReviewed(BusinessDocumentReviewedEvent event) {
        mailService.sendHtml(
                event.email(),
                subjectOf(event),
                TEMPLATE,
                Map.of(
                        "subjectTitle", subjectOf(event),
                        "name", event.name(),
                        "headline", headlineOf(event),
                        "documentLabel", labelOf(event.documentType()),
                        "companyName", event.companyName(),
                        "message", messageOf(event),
                        "link", appProperties.frontendUrl() + VERIFICATION_PATH,
                        "supportEmail", appProperties.supportEmail()));
    }

    private String subjectOf(BusinessDocumentReviewedEvent event) {
        return switch (event.outcome()) {
            case APPROVED -> "Your InterVue business document was approved";
            case REJECTED -> "Your InterVue business document was rejected";
            case MORE_INFO_REQUIRED -> "InterVue needs another document from you";
            default -> "Update on your InterVue business document";
        };
    }

    private String headlineOf(BusinessDocumentReviewedEvent event) {
        return switch (event.outcome()) {
            case APPROVED ->
                    "Our compliance team reviewed your document and approved it. You can now publish"
                            + " jobs and receive candidate applications.";
            case REJECTED ->
                    "Our compliance team reviewed your document and could not accept it. You can"
                            + " submit a corrected document at any time.";
            case MORE_INFO_REQUIRED ->
                    "Our compliance team started reviewing your document and needs something else"
                            + " before a decision can be made.";
            default -> "The status of your document has changed.";
        };
    }

    private String messageOf(BusinessDocumentReviewedEvent event) {
        if (event.outcome() == DocumentReviewStatus.APPROVED && event.expiresAt() != null) {
            return "This authorization is valid until "
                    + EXPIRY_DATE.format(event.expiresAt())
                    + ". Submit a renewed document before that date to keep publishing.";
        }
        return event.reason() == null || event.reason().isBlank()
                ? "Open your verification page to see the current status."
                : "Reason given: " + event.reason();
    }

    private String labelOf(BusinessDocumentType documentType) {
        return documentType == BusinessDocumentType.BUSINESS_LICENSE
                ? "Business registration certificate"
                : "Letter of authorization";
    }
}
