package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.resources.JobSearchResult;
import com.techx.intervue.modules.ai.services.interfaces.JobSearchServiceInterface;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.JobSort;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.resources.SkillResource;
import com.techx.intervue.modules.job.services.interfaces.PublicJobServiceInterface;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobSearchService implements JobSearchServiceInterface {

    private final PublicJobServiceInterface publicJobService;

    @Override
    public List<JobSearchResult> search(
            String keyword, String level, String location, String sort, int limit) {
        int maxResults = Math.min(Math.max(1, limit), 20);
        String q = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        String city = (location != null && !location.isBlank()) ? location.trim() : null;

        SearchJobsRequest request =
                new SearchJobsRequest(
                        q,
                        city,
                        null,
                        null,
                        null,
                        parseLevel(level),
                        null,
                        null,
                        null,
                        null,
                        parseSort(sort),
                        null,
                        null);
        return publicJobService.search(request, PageRequest.of(0, maxResults)).stream()
                .map(this::toSearchResult)
                .toList();
    }

    private JobSearchResult toSearchResult(PublicJobSummaryResource job) {
        String salaryText = "Thỏa thuận";
        if (job.salary() != null) {
            if (job.salary().negotiable()) {
                salaryText = "Lương thỏa thuận";
            } else if (job.salary().min() != null && job.salary().max() != null) {
                salaryText =
                        String.format(
                                "%,d - %,d %s",
                                job.salary().min(),
                                job.salary().max(),
                                job.salary().currency() != null ? job.salary().currency() : "VND");
            } else if (job.salary().min() != null) {
                salaryText =
                        String.format(
                                "Từ %,d %s",
                                job.salary().min(),
                                job.salary().currency() != null ? job.salary().currency() : "VND");
            }
        }

        List<String> skills =
                job.skills() != null
                        ? job.skills().stream().map(SkillResource::name).toList()
                        : List.of();

        String companyName =
                job.company() != null && job.company().name() != null
                        ? job.company().name()
                        : "Doanh nghiệp đối tác";

        return new JobSearchResult(
                String.valueOf(job.id()),
                job.title(),
                companyName,
                salaryText,
                job.city() != null ? job.city() : "Toàn quốc",
                job.level() != null ? job.level().name() : "Mọi cấp bậc",
                skills,
                "Tin tuyển dụng đang mở tại "
                        + companyName
                        + ". Xem chi tiết yêu cầu để ứng tuyển.",
                "/jobs/" + job.id());
    }

    private JobLevel parseLevel(String level) {
        if (level == null || level.isBlank()) {
            return null;
        }
        String clean = level.trim().toUpperCase(Locale.ROOT);
        try {
            return JobLevel.valueOf(clean);
        } catch (IllegalArgumentException ex) {
            return switch (clean) {
                case "FRESHER", "INTERNSHIP" -> JobLevel.INTERN;
                case "JUNIOR DEVELOPER" -> JobLevel.JUNIOR;
                case "MIDDLE", "MID-LEVEL" -> JobLevel.MID;
                case "TECH LEAD", "TEAM LEAD" -> JobLevel.LEAD;
                default -> null;
            };
        }
    }

    private JobSort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return null;
        }
        try {
            return JobSort.valueOf(sort.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
