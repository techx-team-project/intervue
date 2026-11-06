package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.job.enums.ScreeningQuestionType;
import com.techx.intervue.modules.job.requests.SaveJobRequest.ScreeningQuestion;
import com.techx.intervue.resources.FieldErrorResource;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class ScreeningQuestionRules {

    private static final int MIN_OPTIONS = 2;
    private static final int MAX_OPTIONS = 6;

    public List<ScreeningQuestion> normalise(List<ScreeningQuestion> questions) {
        List<FieldErrorResource> problems = new ArrayList<>();
        List<ScreeningQuestion> normalised = new ArrayList<>();
        for (int index = 0; index < questions.size(); index++) {
            ScreeningQuestion question = questions.get(index);
            List<String> options = cleanOptions(question.options());
            if (question.type() == ScreeningQuestionType.CHOICE) {
                checkChoiceOptions(index, options, problems);
            } else {
                options = List.of();
            }
            normalised.add(
                    new ScreeningQuestion(
                            question.type(),
                            question.prompt().trim(),
                            question.required(),
                            options));
        }
        if (!problems.isEmpty()) {
            throw AppException.validation(problems);
        }
        return normalised;
    }

    private void checkChoiceOptions(
            int index, List<String> options, List<FieldErrorResource> problems) {
        String field = "screeningQuestions[" + index + "].options";
        if (options.size() < MIN_OPTIONS || options.size() > MAX_OPTIONS) {
            problems.add(
                    problem(
                            field,
                            "A choice question needs "
                                    + MIN_OPTIONS
                                    + " to "
                                    + MAX_OPTIONS
                                    + " options"));
            return;
        }
        long distinct =
                options.stream().map(option -> option.toLowerCase(Locale.ROOT)).distinct().count();
        if (distinct != options.size()) {
            problems.add(problem(field, "Options must be different from each other"));
        }
    }

    private List<String> cleanOptions(List<String> options) {
        if (options == null) {
            return List.of();
        }
        return options.stream()
                .map(String::trim)
                .filter(option -> !option.isEmpty())
                .collect(Collectors.toList());
    }

    private FieldErrorResource problem(String field, String message) {
        return FieldErrorResource.builder().field(field).message(message).build();
    }
}
