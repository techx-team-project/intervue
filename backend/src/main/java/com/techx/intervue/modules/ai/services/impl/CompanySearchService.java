package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.resources.CompanySearchResult;
import com.techx.intervue.modules.ai.services.interfaces.CompanySearchServiceInterface;
import com.techx.intervue.modules.company.requests.SearchCompaniesRequest;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import com.techx.intervue.modules.company.resources.PublicCompanyResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.job.repositories.JobRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanySearchService implements CompanySearchServiceInterface {

    private static final int MAX_RESULTS = 10;
    private static final String NOT_UPDATED = "Chưa cập nhật";

    private final CompanyServiceInterface companyService;
    private final JobRepository jobRepository;

    @Override
    public List<CompanySearchResult> search(
            String keyword, String industry, String location, int limit) {
        int maxResults = Math.min(Math.max(1, limit), MAX_RESULTS);
        return companyService
                .search(new SearchCompaniesRequest(keyword), PageRequest.of(0, maxResults))
                .stream()
                .map(this::toSearchResult)
                .toList();
    }

    private CompanySearchResult toSearchResult(CompanySummaryResource summary) {
        PublicCompanyResource detail = companyService.findPublic(summary.id());

        List<String> highlights =
                detail.benefits() != null && !detail.benefits().isBlank()
                        ? List.of(detail.benefits())
                        : List.of();

        int openJobs =
                (int)
                        jobRepository.countByStatusForRecruiter(summary.id()).stream()
                                .mapToLong(sc -> sc.getTotal())
                                .sum();

        return new CompanySearchResult(
                String.valueOf(summary.id()),
                summary.name(),
                detail.industry() != null ? detail.industry() : NOT_UPDATED,
                detail.size() != null ? detail.size() : NOT_UPDATED,
                summary.address() != null ? summary.address() : NOT_UPDATED,
                detail.website() != null ? detail.website() : "",
                openJobs,
                highlights,
                "/companies/" + summary.id());
    }
}
