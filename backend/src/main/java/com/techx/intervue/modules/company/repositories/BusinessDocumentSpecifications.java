package com.techx.intervue.modules.company.repositories;

import com.techx.intervue.common.persistence.SpecificationSupport;
import com.techx.intervue.modules.company.entities.BusinessDocument;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.requests.SearchBusinessVerificationRequest;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class BusinessDocumentSpecifications {

    private BusinessDocumentSpecifications() {}

    public static Specification<BusinessDocument> matching(
            SearchBusinessVerificationRequest request) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.reviewStatus() != null) {
                predicates.add(builder.equal(root.get("reviewStatus"), request.reviewStatus()));
            }
            if (request.documentType() != null) {
                predicates.add(builder.equal(root.get("documentType"), request.documentType()));
            }
            if (request.q() != null && !request.q().isBlank()) {
                String pattern = SpecificationSupport.containsPattern(request.q());
                Join<BusinessDocument, Company> company = root.join("company");
                predicates.add(
                        builder.or(
                                builder.like(builder.lower(company.get("name")), pattern),
                                builder.like(builder.lower(company.get("taxCode")), pattern),
                                builder.like(
                                        builder.lower(root.get("originalFileName")), pattern)));
            }

            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
