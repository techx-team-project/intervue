package com.techx.intervue.modules.candidate.mappers;

import com.techx.intervue.common.text.Texts;
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
        project.setRole(Texts.blankToNull(request.role()));
        project.setStartDate(request.startDate());
        project.setCurrent(current);
        project.setEndDate(current ? null : request.endDate());
        project.setDescription(Texts.blankToNull(request.description()));
        project.setHighlights(Texts.blankToNull(request.highlights()));
        project.setGithubUrl(Texts.blankToNull(request.githubUrl()));
        project.setDemoUrl(Texts.blankToNull(request.demoUrl()));
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
}
