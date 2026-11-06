package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.resources.FieldErrorResource;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class JobPublishRules {

    private static final int MIN_DESCRIPTION_LENGTH = 50;
    private static final int MIN_REQUIREMENTS_LENGTH = 20;

    public void assertComplete(Job job) {
        List<FieldErrorResource> problems = new ArrayList<>();
        if (job.getLevel() == null) {
            problems.add(problem("level", "Choose a level"));
        }
        if (job.getContractType() == null) {
            problems.add(problem("contractType", "Choose a contract type"));
        }
        if (job.getWorkingArrangement() == null) {
            problems.add(problem("workingArrangement", "Choose a working arrangement"));
        }
        if (job.getCity() == null) {
            problems.add(problem("location.city", "Enter the city"));
        }
        if (job.getSkills().isEmpty()) {
            problems.add(problem("skillIds", "Add at least one skill"));
        }
        if (isShorterThan(job.getDescription(), MIN_DESCRIPTION_LENGTH)) {
            problems.add(
                    problem(
                            "description",
                            "Description must be at least "
                                    + MIN_DESCRIPTION_LENGTH
                                    + " characters"));
        }
        if (isShorterThan(job.getRequirements(), MIN_REQUIREMENTS_LENGTH)) {
            problems.add(
                    problem(
                            "requirements",
                            "Requirements must be at least "
                                    + MIN_REQUIREMENTS_LENGTH
                                    + " characters"));
        }
        problems.addAll(salaryProblems(job));
        if (job.getDeadline() == null || job.getDeadline().isBefore(JobDeadlines.today())) {
            problems.add(problem("deadline", "Set a deadline that is today or later"));
        }
        if (!problems.isEmpty()) {
            throw AppException.validation(problems);
        }
    }

    private List<FieldErrorResource> salaryProblems(Job job) {
        if (job.isSalaryNegotiable()) {
            return List.of();
        }
        if (job.getSalaryMin() == null || job.getSalaryMax() == null) {
            return List.of(problem("salary.max", "Enter a salary range or mark it as negotiable"));
        }
        if (job.getSalaryMin() > job.getSalaryMax()) {
            return List.of(problem("salary.min", "Minimum salary must not exceed the maximum"));
        }
        return List.of();
    }

    private boolean isShorterThan(String value, int minLength) {
        return value == null || value.trim().length() < minLength;
    }

    private FieldErrorResource problem(String field, String message) {
        return FieldErrorResource.builder().field(field).message(message).build();
    }
}
