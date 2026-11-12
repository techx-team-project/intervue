package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.resources.JobResource;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobActivityRecorder {

    private final AuditLogServiceInterface auditLogService;

    public void record(Long recruiterId, AuditAction action, Job job, String detail) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.RECRUITER)
                        .actorId(recruiterId)
                        .action(action)
                        .targetType(AuditTargetType.JOB)
                        .targetId(job.getId())
                        .detail(detail)
                        .build());
    }

    public List<String> changedFieldNames(JobResource before, JobResource after) {
        Map<String, Object> previous = snapshot(before);
        Map<String, Object> current = snapshot(after);
        return previous.keySet().stream()
                .filter(field -> !Objects.equals(previous.get(field), current.get(field)))
                .toList();
    }

    public String changedFields(JobResource before, JobResource after) {
        return String.join(", ", changedFieldNames(before, after));
    }

    private Map<String, Object> snapshot(JobResource job) {
        Map<String, Object> fields = new LinkedHashMap<>();
        fields.put("title", job.title());
        fields.put("level", job.level());
        fields.put("jobRole", job.jobRole());
        fields.put("experience", job.experience());
        fields.put("contractType", job.contractType());
        fields.put("workingArrangement", job.workingArrangement());
        fields.put("location", job.location());
        fields.put("salary", job.salary());
        fields.put("skills", job.skills());
        fields.put("description", job.description());
        fields.put("requirements", job.requirements());
        fields.put("benefits", job.benefits());
        fields.put("benefitTags", job.benefitTags());
        fields.put("hiringSteps", job.hiringSteps());
        fields.put("screeningQuestions", job.screeningQuestions());
        fields.put("deadline", job.deadline());
        fields.put("openings", job.openings());
        return fields;
    }
}
