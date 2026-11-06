package com.techx.intervue.modules.candidate.mappers;

import com.techx.intervue.modules.candidate.entities.CandidateResume;
import com.techx.intervue.modules.candidate.resources.CandidateResumeResource;
import org.springframework.stereotype.Component;

@Component
public class CandidateResumeMapper {

    private static final String DOWNLOAD_PATH = "/api/v1/candidate/cvs/%d/download";

    public CandidateResumeResource toResource(CandidateResume resume) {
        return CandidateResumeResource.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .url(DOWNLOAD_PATH.formatted(resume.getId()))
                .fileSizeBytes(resume.getFileSizeBytes())
                .contentType(resume.getContentType())
                .isDefault(resume.isDefault())
                .parsedSummary(resume.getParsedSummary())
                .createdAt(resume.getCreatedAt())
                .build();
    }
}
