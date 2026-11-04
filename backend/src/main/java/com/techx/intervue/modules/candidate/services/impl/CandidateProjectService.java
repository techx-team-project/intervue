package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.entities.CandidateProject;
import com.techx.intervue.modules.candidate.entities.CandidateProjectTechnology;
import com.techx.intervue.modules.candidate.mappers.CandidateProjectMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateProjectRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateProjectTechnologyRepository;
import com.techx.intervue.modules.candidate.requests.SaveCandidateProjectRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProjectServiceInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CandidateProjectService implements CandidateProjectServiceInterface {

    private static final int MAX_ITEMS = 20;

    private final CandidateProjectRepository projectRepository;
    private final CandidateProjectTechnologyRepository technologyRepository;
    private final CandidateProfileLookup lookup;
    private final CandidateProjectMapper mapper;
    private final CandidateTextNormalizer normalizer;
    private final CandidateProfileServiceInterface profileService;

    @Override
    @Transactional
    public CandidateProfileResource create(SaveCandidateProjectRequest request, Long userId) {
        CandidateProfile profile = lookup.findOrCreateForUpdate(userId);
        lookup.checkLimit(projectRepository.countByCandidateProfileId(profile.getId()), MAX_ITEMS);

        CandidateProject project = CandidateProject.builder().candidateProfile(profile).build();
        mapper.apply(project, request);
        CandidateProject saved = projectRepository.save(project);
        saveChildren(saved, request.technologies());
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource update(
            Long id, SaveCandidateProjectRequest request, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        CandidateProject project = requireOwned(profile, id);
        mapper.apply(project, request);
        projectRepository.save(project);
        technologyRepository.deleteByCandidateProjectId(id);
        saveChildren(project, request.technologies());
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource delete(Long id, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        CandidateProject project = requireOwned(profile, id);
        technologyRepository.deleteByCandidateProjectId(id);
        projectRepository.delete(project);
        return profileService.getMine(userId);
    }

    private CandidateProject requireOwned(CandidateProfile profile, Long id) {
        return projectRepository
                .findByIdAndCandidateProfileId(id, profile.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private void saveChildren(CandidateProject project, List<String> values) {
        technologyRepository.saveAll(
                normalizer.normalizeValues(values).stream()
                        .map(
                                value ->
                                        CandidateProjectTechnology.builder()
                                                .candidateProject(project)
                                                .technology(value)
                                                .build())
                        .toList());
    }
}
