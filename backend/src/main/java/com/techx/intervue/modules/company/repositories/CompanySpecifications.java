package com.techx.intervue.modules.company.repositories;

import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.requests.SearchCompaniesRequest;
import org.springframework.data.jpa.domain.Specification;

public final class CompanySpecifications {

    private CompanySpecifications() {}

    public static Specification<Company> matching(SearchCompaniesRequest request) {
        return (root, query, builder) -> {
            String pattern = "%" + request.q().trim().toLowerCase() + "%";
            return builder.or(
                    builder.like(builder.lower(root.get("name")), pattern),
                    builder.like(builder.lower(root.get("tradingName")), pattern),
                    builder.like(builder.lower(root.get("taxCode")), pattern));
        };
    }
}
