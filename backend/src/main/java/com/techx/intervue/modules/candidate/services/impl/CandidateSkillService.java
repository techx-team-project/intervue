package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.entities.CandidateSkill;
import com.techx.intervue.modules.candidate.mappers.CandidateSkillMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateSkillRepository;
import com.techx.intervue.modules.candidate.requests.SaveCandidateSkillRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateSkillServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CandidateSkillService implements CandidateSkillServiceInterface {

    private static final int MAX_ITEMS = 50;

    private final CandidateSkillRepository skillRepository;
    private final CandidateProfileLookup lookup;
    private final CandidateSkillMapper mapper;
    private final CandidateTextNormalizer normalizer;
    private final CandidateProfileServiceInterface profileService;

    @Override
    @Transactional
    public CandidateProfileResource create(SaveCandidateSkillRequest request, Long userId) {
        CandidateProfile profile = lookup.findOrCreateForUpdate(userId);
        lookup.checkLimit(skillRepository.countByCandidateProfileId(profile.getId()), MAX_ITEMS);
        requireUnique(profile.getId(), null, request.name());

        CandidateSkill skill = CandidateSkill.builder().candidateProfile(profile).build();
        mapper.apply(skill, request);
        skillRepository.save(skill);
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource update(
            Long id, SaveCandidateSkillRequest request, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        CandidateSkill skill = requireOwned(profile, id);
        requireUnique(profile.getId(), id, request.name());
        mapper.apply(skill, request);
        skillRepository.save(skill);
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource delete(Long id, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        skillRepository.delete(requireOwned(profile, id));
        return profileService.getMine(userId);
    }

    private CandidateSkill requireOwned(CandidateProfile profile, Long id) {
        return skillRepository
                .findByIdAndCandidateProfileId(id, profile.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private void requireUnique(Long profileId, Long excludedId, String value) {
        for (CandidateSkill existing :
                skillRepository.findByCandidateProfileIdOrderByNameAsc(profileId)) {
            if (!existing.getId().equals(excludedId)
                    && normalizer.sameText(existing.getName(), value)) {
                throw AppException.validation("name", "You already added this skill");
            }
        }
    }
}
