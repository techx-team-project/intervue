package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.CandidateExperience;
import com.techx.intervue.modules.candidate.entities.CandidateExperienceSkill;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.mappers.CandidateExperienceMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateExperienceRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateExperienceSkillRepository;
import com.techx.intervue.modules.candidate.requests.SaveCandidateExperienceRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateExperienceServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CandidateExperienceService implements CandidateExperienceServiceInterface {

    private static final int MAX_ITEMS = 20;

    private final CandidateExperienceRepository experienceRepository;
    private final CandidateExperienceSkillRepository skillRepository;
    private final CandidateProfileLookup lookup;
    private final CandidateExperienceMapper mapper;
    private final CandidateTextNormalizer normalizer;
    private final CandidateProfileServiceInterface profileService;

    @Override
    @Transactional
    public CandidateProfileResource create(SaveCandidateExperienceRequest request, Long userId) {
        CandidateProfile profile = lookup.findOrCreateForUpdate(userId);
        lookup.checkLimit(
                experienceRepository.countByCandidateProfileId(profile.getId()), MAX_ITEMS);

        CandidateExperience experience =
                CandidateExperience.builder().candidateProfile(profile).build();
        mapper.apply(experience, request);
        CandidateExperience saved = experienceRepository.save(experience);
        saveChildren(saved, request.skills());
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource update(
            Long id, SaveCandidateExperienceRequest request, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        CandidateExperience experience = requireOwned(profile, id);
        mapper.apply(experience, request);
        experienceRepository.save(experience);
        skillRepository.deleteByCandidateExperienceId(id);
        saveChildren(experience, request.skills());
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource delete(Long id, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        CandidateExperience experience = requireOwned(profile, id);
        skillRepository.deleteByCandidateExperienceId(id);
        experienceRepository.delete(experience);
        return profileService.getMine(userId);
    }

    private CandidateExperience requireOwned(CandidateProfile profile, Long id) {
        return experienceRepository
                .findByIdAndCandidateProfileId(id, profile.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private void saveChildren(CandidateExperience experience, List<String> values) {
        skillRepository.saveAll(
                normalizer.normalizeValues(values).stream()
                        .map(
                                value ->
                                        CandidateExperienceSkill.builder()
                                                .candidateExperience(experience)
                                                .skill(value)
                                                .build())
                        .toList());
    }
}
