package com.techx.intervue.modules.moderation.repositories;

import com.techx.intervue.modules.moderation.entities.Report;
import com.techx.intervue.modules.moderation.enums.ReportStatus;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import org.springframework.data.jpa.domain.Specification;

public final class ReportSpecifications {

    private ReportSpecifications() {}

    public static Specification<Report> matching(ReportTargetType targetType, ReportStatus status) {
        return (root, query, builder) -> {
            var predicate = builder.conjunction();
            if (targetType != null) {
                predicate =
                        builder.and(predicate, builder.equal(root.get("targetType"), targetType));
            }
            if (status != null) {
                predicate = builder.and(predicate, builder.equal(root.get("status"), status));
            }
            return predicate;
        };
    }
}
