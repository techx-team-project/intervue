package com.techx.intervue.modules.job.mappers;

import com.techx.intervue.common.text.Texts;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.requests.SaveJobRequest;
import com.techx.intervue.modules.job.resources.JobResource;
import com.techx.intervue.modules.job.resources.JobSummaryResource;
import com.techx.intervue.modules.job.resources.PublicJobCompanyResource;
import com.techx.intervue.modules.job.resources.PublicJobResource;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.resources.SkillResource;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobMapper {

    private final SkillMapper skillMapper;

    public void apply(Job job, SaveJobRequest request, Set<Skill> skills) {
        job.setTitle(request.title().trim());
        job.setLevel(request.level());
        job.setContractType(request.contractType());
        job.setWorkingArrangement(request.workingArrangement());
        job.setCity(
                request.location() == null ? null : Texts.blankToNull(request.location().city()));
        job.setAddress(
                request.location() == null
                        ? null
                        : Texts.blankToNull(request.location().address()));
        applySalary(job, request.salary());
        job.setDescription(Texts.blankToNull(request.description()));
        job.setRequirements(Texts.blankToNull(request.requirements()));
        job.setBenefits(Texts.blankToNull(request.benefits()));
        job.setDeadline(request.deadline());
        job.setOpenings(request.openings() == null ? 1 : request.openings());
        job.setSkills(new HashSet<>(skills));
    }

    public JobResource toResource(Job job) {
        return JobResource.builder()
                .id(job.getId())
                .title(job.getTitle())
                .status(job.getStatus())
                .companyName(job.getCompanyName())
                .level(job.getLevel())
                .contractType(job.getContractType())
                .workingArrangement(job.getWorkingArrangement())
                .location(new JobResource.Location(job.getCity(), job.getAddress()))
                .salary(toSalary(job))
                .skills(toSkills(job))
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .applicationMode(job.getApplicationMode())
                .openings(job.getOpenings())
                .deadline(job.getDeadline())
                .publishedAt(job.getPublishedAt())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    public JobSummaryResource toSummary(Job job) {
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
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    public PublicJobSummaryResource toPublicSummary(Job job, String logoUrl) {
        return PublicJobSummaryResource.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(toPublicCompany(job, logoUrl, null))
                .level(job.getLevel())
                .contractType(job.getContractType())
                .workingArrangement(job.getWorkingArrangement())
                .city(job.getCity())
                .salary(toSalary(job))
                .skills(toSkills(job))
                .deadline(job.getDeadline())
                .publishedAt(job.getPublishedAt())
                .build();
    }

    public PublicJobResource toPublicResource(Job job, String logoUrl, String companyAddress) {
        return PublicJobResource.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(toPublicCompany(job, logoUrl, companyAddress))
                .level(job.getLevel())
                .contractType(job.getContractType())
                .workingArrangement(job.getWorkingArrangement())
                .location(new JobResource.Location(job.getCity(), job.getAddress()))
                .salary(toSalary(job))
                .skills(toSkills(job))
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .openings(job.getOpenings())
                .deadline(job.getDeadline())
                .publishedAt(job.getPublishedAt())
                .build();
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

    private void applySalary(Job job, SaveJobRequest.Salary salary) {
        if (salary == null) {
            job.setSalaryNegotiable(false);
            job.setSalaryMin(null);
            job.setSalaryMax(null);
            job.setSalaryCurrency(null);
            return;
        }
        job.setSalaryNegotiable(salary.negotiable());
        job.setSalaryMin(salary.negotiable() ? null : salary.min());
        job.setSalaryMax(salary.negotiable() ? null : salary.max());
        job.setSalaryCurrency(salary.negotiable() ? null : salary.currency());
    }

    private JobResource.Salary toSalary(Job job) {
        return new JobResource.Salary(
                job.isSalaryNegotiable(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getSalaryCurrency());
    }
}
