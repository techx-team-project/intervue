package com.techx.intervue.modules.candidate.mappers;

import com.techx.intervue.modules.candidate.entities.CandidateProject;
import com.techx.intervue.modules.candidate.requests.SaveCandidateProjectRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProjectResource;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CandidateProjectMapper {

    public void apply(CandidateProject project, SaveCandidateProjectRequest request) {
        boolean current = request.current();
        project.setName(request.name().trim());
        project.setRole(blankToNull(request.role()));
        project.setStartDate(request.startDate());
        project.setCurrent(current);
        project.setEndDate(current ? null : request.endDate());
        project.setDescription(blankToNull(request.description()));
        project.setHighlights(blankToNull(request.highlights()));
        project.setGithubUrl(blankToNull(request.githubUrl()));
        project.setDemoUrl(blankToNull(request.demoUrl()));
    }

    public CandidateProjectResource toResource(
            CandidateProject project, List<String> technologies) {
        return CandidateProjectResource.builder()
                .id(project.getId())
                .name(project.getName())
                .role(project.getRole())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .current(project.isCurrent())
                .description(project.getDescription())
                .highlights(project.getHighlights())
                .githubUrl(project.getGithubUrl())
                .demoUrl(project.getDemoUrl())
                .technologies(technologies.stream().sorted(String.CASE_INSENSITIVE_ORDER).toList())
                .build();
    }

    private String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
