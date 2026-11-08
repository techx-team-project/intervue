package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.application.requests.SaveApplicationRequest.Answer;
import com.techx.intervue.modules.job.enums.ScreeningQuestionType;
import com.techx.intervue.modules.job.services.interfaces.JobLookupInterface.ApplyQuestion;
import com.techx.intervue.resources.FieldErrorResource;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class ApplicationAnswerRules {

    // Keeps only answers to questions the job still has; drafts may be partial.
    public Map<ApplyQuestion, String> collect(List<ApplyQuestion> questions, List<Answer> answers) {
        Map<Long, String> byQuestion = new LinkedHashMap<>();
        if (answers != null) {
            for (Answer answer : answers) {
                String text = answer.answer() == null ? "" : answer.answer().trim();
                byQuestion.put(answer.questionId(), text);
            }
        }
        Map<ApplyQuestion, String> collected = new LinkedHashMap<>();
        for (ApplyQuestion question : questions) {
            String text = byQuestion.get(question.id());
            if (text != null && !text.isEmpty()) {
                collected.put(question, text);
            }
        }
        return collected;
    }

    public void requireComplete(List<ApplyQuestion> questions, Map<ApplyQuestion, String> given) {
        List<FieldErrorResource> problems = new ArrayList<>();
        for (int index = 0; index < questions.size(); index++) {
            ApplyQuestion question = questions.get(index);
            String text = given.get(question);
            String field = "answers[" + index + "]";
            if (text == null) {
                if (question.required()) {
                    problems.add(problem(field, "This question is required"));
                }
            } else if (question.type() == ScreeningQuestionType.CHOICE
                    && !question.options().contains(text)) {
                problems.add(problem(field, "Choose one of the listed options"));
            }
        }
        if (!problems.isEmpty()) {
            throw AppException.validation(problems);
        }
    }

    private FieldErrorResource problem(String field, String message) {
        return FieldErrorResource.builder().field(field).message(message).build();
    }
}
