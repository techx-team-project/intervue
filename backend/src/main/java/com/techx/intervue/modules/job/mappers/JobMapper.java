package com.techx.intervue.modules.job.mappers;

import com.techx.intervue.common.text.Texts;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.JobScreeningQuestion;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.enums.ApplicationMode;
import com.techx.intervue.modules.job.enums.JobBenefitTag;
import com.techx.intervue.modules.job.enums.ScreeningQuestionType;
import com.techx.intervue.modules.job.requests.SaveJobRequest;
import com.techx.intervue.modules.job.resources.AdminJobSummaryResource;
import com.techx.intervue.modules.job.resources.JobResource;
import com.techx.intervue.modules.job.resources.JobSummaryResource;
import com.techx.intervue.modules.job.resources.PublicJobCompanyResource;
import com.techx.intervue.modules.job.resources.PublicJobResource;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.resources.ScreeningQuestionResource;
import com.techx.intervue.modules.job.resources.ScreeningSummaryResource;
import com.techx.intervue.modules.job.resources.SkillResource;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobMapper {

    private static final int SECONDS_PER_CHOICE = 20;
    private static final int SECONDS_PER_TEXT = 60;

    private final SkillMapper skillMapper;

    public void apply(Job job, SaveJobRequest request, Set<Skill> skills) {
        job.setTitle(request.title().trim());
        job.setLevel(request.level());
        job.setJobRole(request.jobRole());
        job.setExperienceMinYears(
                request.experience() == null ? null : request.experience().minYears());
        job.setExperienceMaxYears(
                request.experience() == null ? null : request.experience().maxYears());
        job.setContractType(request.contractType());
        job.setWorkingArrangement(request.workingArrangement());
        job.setCity(
                request.location() == null ? null : Texts.blankToNull(request.location().city()));
        job.setAddress(
                request.location() == null
                        ? null
                        : Texts.blankToNull(request.location().address()));
        job.setLatitude(request.location() == null ? null : request.location().latitude());
        job.setLongitude(request.location() == null ? null : request.location().longitude());
        applySalary(job, request.salary());
        job.setDescription(Texts.blankToNull(request.description()));
        job.setRequirements(Texts.blankToNull(request.requirements()));
        job.setBenefits(Texts.blankToNull(request.benefits()));
        job.setBenefitTags(distinctTags(request.benefitTags()));
        job.setHiringSteps(cleanSteps(request.hiringSteps()));
        job.setDeadline(request.deadline());
        job.setOpenings(request.openings() == null ? 1 : request.openings());
        job.setSkills(new HashSet<>(skills));
    }

    public JobResource toResource(Job job) {
        Instant now = Instant.now();
        int boostLevel = effectiveBoostLevel(job, now);
        String highlightLabel = effectiveHighlightLabel(job, now);
        boolean highlighted = effectiveHighlighted(job, now);
        return JobResource.builder()
                .id(job.getId())
                .title(job.getTitle())
                .status(job.getStatus())
                .companyName(job.getCompanyName())
                .level(job.getLevel())
                .jobRole(job.getJobRole())
                .experience(toExperience(job))
                .contractType(job.getContractType())
                .workingArrangement(job.getWorkingArrangement())
                .location(
                        new JobResource.Location(
                                job.getCity(),
                                job.getAddress(),
                                job.getLatitude(),
                                job.getLongitude()))
                .salary(toSalary(job))
                .skills(toSkills(job))
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .benefitTags(job.getBenefitTags())
                .hiringSteps(job.getHiringSteps())
                .applicationMode(job.getApplicationMode())
                .screeningQuestions(toQuestions(job))
                .openings(job.getOpenings())
                .deadline(job.getDeadline())
                .publishedAt(job.getPublishedAt())
                .retoppedAt(job.getRetoppedAt())
                .hiddenReason(job.getHiddenReason())
                .hiddenAt(job.getHiddenAt())
                .boostLevel(boostLevel)
                .boostExpiresAt(boostLevel > 0 ? job.getBoostExpiresAt() : null)
                .highlightLabel(highlightLabel)
                .highlightLabelExpiresAt(
                        highlightLabel != null ? job.getHighlightLabelExpiresAt() : null)
                .highlighted(highlighted)
                .highlightExpiresAt(highlighted ? job.getHighlightExpiresAt() : null)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    public JobSummaryResource toSummary(Job job) {
        Instant now = Instant.now();
        return JobSummaryResource.builder()
                .id(job.getId())
                .title(job.getTitle())
                .status(job.getStatus())
                .level(job.getLevel())
                .contractType(job.getContractType())
                .workingArrangement(job.getWorkingArrangement())
                .city(job.getCity())
                .salary(toSalary(job))
                .openings(job.getOpenings())
                .deadline(job.getDeadline())
                .publishedAt(job.getPublishedAt())
                .retoppedAt(job.getRetoppedAt())
                .boostLevel(effectiveBoostLevel(job, now))
                .highlightLabel(effectiveHighlightLabel(job, now))
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    public AdminJobSummaryResource toAdminSummary(Job job) {
        return AdminJobSummaryResource.builder()
                .id(job.getId())
                .title(job.getTitle())
                .status(job.getStatus())
                .companyId(job.getCompanyId())
                .companyName(job.getCompanyName())
                .level(job.getLevel())
                .city(job.getCity())
                .salary(toSalary(job))
                .deadline(job.getDeadline())
                .publishedAt(job.getPublishedAt())
                .hiddenReason(job.getHiddenReason())
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    public PublicJobSummaryResource toPublicSummary(Job job, String logoUrl) {
        Instant now = Instant.now();
        return PublicJobSummaryResource.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(toPublicCompany(job, logoUrl, null))
                .level(job.getLevel())
                .jobRole(job.getJobRole())
                .contractType(job.getContractType())
                .workingArrangement(job.getWorkingArrangement())
                .city(job.getCity())
                .salary(toSalary(job))
                .skills(toSkills(job))
                .deadline(job.getDeadline())
                .publishedAt(job.getPublishedAt())
                .boostLevel(effectiveBoostLevel(job, now))
                .highlightLabel(effectiveHighlightLabel(job, now))
                .highlighted(effectiveHighlighted(job, now))
                .build();
    }

    public PublicJobResource toPublicResource(Job job, String logoUrl, String companyAddress) {
        Instant now = Instant.now();
        return PublicJobResource.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(toPublicCompany(job, logoUrl, companyAddress))
                .level(job.getLevel())
                .jobRole(job.getJobRole())
                .experience(toExperience(job))
                .contractType(job.getContractType())
                .workingArrangement(job.getWorkingArrangement())
                .location(
                        new JobResource.Location(
                                job.getCity(),
                                job.getAddress(),
                                job.getLatitude(),
                                job.getLongitude()))
                .salary(toSalary(job))
                .skills(toSkills(job))
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .benefitTags(job.getBenefitTags())
                .hiringSteps(job.getHiringSteps())
                .openings(job.getOpenings())
                .screening(toScreeningSummary(job))
                .deadline(job.getDeadline())
                .publishedAt(job.getPublishedAt())
                .boostLevel(effectiveBoostLevel(job, now))
                .highlightLabel(effectiveHighlightLabel(job, now))
                .highlighted(effectiveHighlighted(job, now))
                .build();
    }

    private int effectiveBoostLevel(Job job, Instant now) {
        if (job.getBoostLevel() == null || job.getBoostLevel() <= 0) {
            return 0;
        }
        return job.getBoostExpiresAt() == null || job.getBoostExpiresAt().isAfter(now)
                ? job.getBoostLevel()
                : 0;
    }

    private String effectiveHighlightLabel(Job job, Instant now) {
        if (job.getHighlightLabel() == null) {
            return null;
        }
        return job.getHighlightLabelExpiresAt() == null
                        || job.getHighlightLabelExpiresAt().isAfter(now)
                ? job.getHighlightLabel()
                : null;
    }

    private boolean effectiveHighlighted(Job job, Instant now) {
        return Boolean.TRUE.equals(job.getHighlighted())
                && (job.getHighlightExpiresAt() == null
                        || job.getHighlightExpiresAt().isAfter(now));
    }

    private PublicJobCompanyResource toPublicCompany(
            Job job, String logoUrl, String companyAddress) {
        return new PublicJobCompanyResource(
                job.getCompanyId(), job.getCompanyName(), logoUrl, companyAddress);
    }

    private List<SkillResource> toSkills(Job job) {
        return job.getSkills().stream()
                .sorted(Comparator.comparing(Skill::getName))
                .map(skillMapper::toResource)
                .toList();
    }

    public boolean hasSameScreeningQuestions(
            Job job, List<SaveJobRequest.ScreeningQuestion> questions) {
        List<SaveJobRequest.ScreeningQuestion> current =
                job.getScreeningQuestions().stream()
                        .map(
                                question ->
                                        new SaveJobRequest.ScreeningQuestion(
                                                question.getType(),
                                                question.getPrompt(),
                                                question.isRequired(),
                                                question.getOptions() == null
                                                        ? List.of()
                                                        : question.getOptions()))
                        .toList();
        return current.equals(questions);
    }

    public void replaceScreeningQuestions(
            Job job, List<SaveJobRequest.ScreeningQuestion> questions) {
        job.getScreeningQuestions().clear();
        for (int index = 0; index < questions.size(); index++) {
            SaveJobRequest.ScreeningQuestion question = questions.get(index);
            job.getScreeningQuestions()
                    .add(
                            JobScreeningQuestion.builder()
                                    .job(job)
                                    .position((byte) index)
                                    .type(question.type())
                                    .prompt(question.prompt())
                                    .required(question.required())
                                    .options(
                                            question.type() == ScreeningQuestionType.CHOICE
                                                    ? new ArrayList<>(question.options())
                                                    : null)
                                    .build());
        }
        job.setApplicationMode(
                questions.isEmpty() ? ApplicationMode.CV_ONLY : ApplicationMode.CV_AND_QUESTIONS);
    }

    private List<ScreeningQuestionResource> toQuestions(Job job) {
        return job.getScreeningQuestions().stream()
                .map(
                        question ->
                                new ScreeningQuestionResource(
                                        question.getId(),
                                        question.getType(),
                                        question.getPrompt(),
                                        question.isRequired(),
                                        question.getOptions()))
                .toList();
    }

    private ScreeningSummaryResource toScreeningSummary(Job job) {
        List<JobScreeningQuestion> questions = job.getScreeningQuestions();
        int seconds =
                questions.stream()
                        .mapToInt(
                                question ->
                                        question.getType() == ScreeningQuestionType.CHOICE
                                                ? SECONDS_PER_CHOICE
                                                : SECONDS_PER_TEXT)
                        .sum();
        int minutes = questions.isEmpty() ? 0 : Math.max(1, (seconds + 59) / 60);
        int required = (int) questions.stream().filter(JobScreeningQuestion::isRequired).count();
        return new ScreeningSummaryResource(questions.size(), required, minutes);
    }

    private void applySalary(Job job, SaveJobRequest.Salary salary) {
        if (salary == null) {
            job.setSalaryNegotiable(false);
            job.setSalaryMin(null);
            job.setSalaryMax(null);
            job.setSalaryCurrency(null);
            job.setSalaryBasis(null);
            return;
        }
        job.setSalaryNegotiable(salary.negotiable());
        job.setSalaryMin(salary.negotiable() ? null : salary.min());
        job.setSalaryMax(salary.negotiable() ? null : salary.max());
        job.setSalaryCurrency(salary.negotiable() ? null : salary.currency());
        job.setSalaryBasis(salary.negotiable() ? null : salary.basis());
    }

    private List<JobBenefitTag> distinctTags(List<JobBenefitTag> tags) {
        return tags == null ? new ArrayList<>() : new ArrayList<>(new LinkedHashSet<>(tags));
    }

    private List<String> cleanSteps(List<String> steps) {
        return steps == null
                ? new ArrayList<>()
                : steps.stream()
                        .map(Texts::blankToNull)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toCollection(ArrayList::new));
    }

    private JobResource.Experience toExperience(Job job) {
        if (job.getExperienceMinYears() == null && job.getExperienceMaxYears() == null) {
            return null;
        }
        return new JobResource.Experience(job.getExperienceMinYears(), job.getExperienceMaxYears());
    }

    private JobResource.Salary toSalary(Job job) {
        return new JobResource.Salary(
                job.isSalaryNegotiable(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getSalaryCurrency(),
                job.getSalaryBasis());
    }
}
