package com.techx.intervue.modules.company.repositories;

import com.techx.intervue.modules.company.entities.BusinessDocument;
import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessDocumentRepository
        extends JpaRepository<BusinessDocument, Long>, JpaSpecificationExecutor<BusinessDocument> {

    List<BusinessDocument> findByCompanyIdOrderBySubmittedAtDesc(Long companyId);

    boolean existsByCompanyId(Long companyId);

    Optional<BusinessDocument> findFirstBySubmittedByAndDocumentTypeOrderBySubmittedAtDesc(
            Long submittedBy, BusinessDocumentType documentType);

    boolean existsBySubmittedByAndDocumentTypeAndReviewStatus(
            Long submittedBy, BusinessDocumentType documentType, DocumentReviewStatus reviewStatus);

    List<BusinessDocument> findBySubmittedByAndReviewStatus(
            Long submittedBy, DocumentReviewStatus reviewStatus);

    long countByCompanyIdAndDocumentTypeAndReviewStatus(
            Long companyId, BusinessDocumentType documentType, DocumentReviewStatus reviewStatus);

    List<BusinessDocument> findByReviewStatusAndExpiresAtLessThanEqualOrderByExpiresAtAsc(
            DocumentReviewStatus reviewStatus, Instant expiresAt, Pageable pageable);

    interface ReviewStatusCount {
        DocumentReviewStatus getStatus();

        long getTotal();
    }

    @Query(
            "SELECT d.reviewStatus AS status, COUNT(d) AS total FROM BusinessDocument d"
                    + " GROUP BY d.reviewStatus")
    List<ReviewStatusCount> countGroupedByReviewStatus();
}
