package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.CandidateEducation;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.mappers.CandidateEducationMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateEducationRepository;
import com.techx.intervue.modules.candidate.requests.SaveCandidateEducationRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateEducationServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CandidateEducationService implements CandidateEducationServiceInterface {

    private static final int MAX_ITEMS = 10;

    private final CandidateEducationRepository educationRepository;
    private final CandidateProfileLookup lookup;
    private final CandidateEducationMapper mapper;
    private final CandidateProfileServiceInterface profileService;

    @Override
    @Transactional
    public CandidateProfileResource create(SaveCandidateEducationRequest request, Long userId) {
        CandidateProfile profile = lookup.findOrCreateForUpdate(userId);
        lookup.checkLimit(
                educationRepository.countByCandidateProfileId(profile.getId()), MAX_ITEMS);

        CandidateEducation education =
                CandidateEducation.builder().candidateProfile(profile).build();
        mapper.apply(education, request);
        educationRepository.save(education);
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource update(
            Long id, SaveCandidateEducationRequest request, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        CandidateEducation education = requireOwned(profile, id);
        mapper.apply(education, request);
        educationRepository.save(education);
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource delete(Long id, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        educationRepository.delete(requireOwned(profile, id));
        return profileService.getMine(userId);
    }

    private CandidateEducation requireOwned(CandidateProfile profile, Long id) {
        return educationRepository
                .findByIdAndCandidateProfileId(id, profile.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
}
