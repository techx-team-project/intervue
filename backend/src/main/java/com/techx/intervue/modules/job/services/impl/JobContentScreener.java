package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.common.text.ContentTermMatcher;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.connect.enums.ConnectFilterSeverity;
import com.techx.intervue.modules.connect.enums.FilterScope;
import com.techx.intervue.modules.connect.services.interfaces.ConnectFilterWordServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectFilterWordServiceInterface.ActiveFilterWord;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.JobScreeningQuestion;
import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface;
import com.techx.intervue.resources.FieldErrorResource;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobContentScreener {

    private static final int REPORT_NOTE_LIMIT = 1000;
    private static final String OPTION_SEPARATOR = "\n";

    private final ConnectFilterWordServiceInterface filterWordService;
    private final ReportServiceInterface reportService;

    public void assertAllowed(Job job) {
        List<FieldErrorResource> problems =
                scan(job, ConnectFilterSeverity.SEVERE).entrySet().stream()
                        .map(
                                hit ->
                                        FieldErrorResource.builder()
                                                .field(hit.getKey())
                                                .message(
                                                        "Contains terms that are not allowed: "
                                                                + quoted(hit.getValue()))
                                                .build())
                        .toList();
        if (!problems.isEmpty()) {
            throw AppException.validation(problems);
        }
    }

    public void flagForReview(Job job) {
        Map<String, List<String>> hits = scan(job, ConnectFilterSeverity.MILD);
        if (hits.isEmpty()
                || reportService.existsPending(
                        ReportTargetType.JOB_POST, job.getId(), ReporterType.SYSTEM, null)) {
            return;
        }
        String note =
                "Tự động phát hiện qua bộ lọc nội dung tin tuyển dụng. Mẫu khớp: "
                        + hits.entrySet().stream()
                                .map(hit -> hit.getKey() + " (" + quoted(hit.getValue()) + ")")
                                .collect(Collectors.joining("; "));
        reportService.file(
                ReporterType.SYSTEM,
                null,
                ReportTargetType.JOB_POST,
                job.getId(),
                ReportReasonCode.INAPPROPRIATE,
                note.length() > REPORT_NOTE_LIMIT ? note.substring(0, REPORT_NOTE_LIMIT) : note);
    }

    private Map<String, List<String>> scan(Job job, ConnectFilterSeverity severity) {
        List<ActiveFilterWord> words =
                filterWordService.activeWords(FilterScope.JOB).stream()
                        .filter(word -> word.severity() == severity)
                        .toList();
        Map<String, List<String>> hits = new LinkedHashMap<>();
        if (words.isEmpty()) {
            return hits;
        }
        textsOf(job)
                .forEach(
                        (field, text) -> {
                            List<String> matched =
                                    words.stream()
                                            .filter(
                                                    word ->
                                                            ContentTermMatcher.matches(
                                                                    text,
                                                                    word.pattern(),
                                                                    word.regex()))
                                            .map(ActiveFilterWord::pattern)
                                            .toList();
                            if (!matched.isEmpty()) {
                                hits.put(field, matched);
                            }
                        });
        return hits;
    }

    private Map<String, String> textsOf(Job job) {
        Map<String, String> texts = new LinkedHashMap<>();
        texts.put("title", job.getTitle());
        texts.put("description", job.getDescription());
        texts.put("requirements", job.getRequirements());
        texts.put("benefits", job.getBenefits());
        List<String> steps = job.getHiringSteps();
        for (int index = 0; index < steps.size(); index++) {
            texts.put("hiringSteps[" + index + "]", steps.get(index));
        }
        List<JobScreeningQuestion> questions = job.getScreeningQuestions();
        for (int index = 0; index < questions.size(); index++) {
            JobScreeningQuestion question = questions.get(index);
            texts.put("screeningQuestions[" + index + "].prompt", question.getPrompt());
            List<String> options =
                    question.getOptions() == null ? List.of() : question.getOptions();
            texts.put(
                    "screeningQuestions[" + index + "].options",
                    String.join(OPTION_SEPARATOR, new ArrayList<>(options)));
        }
        return texts;
    }

    private String quoted(List<String> terms) {
        return terms.stream().map(term -> "\"" + term + "\"").collect(Collectors.joining(", "));
    }
}
