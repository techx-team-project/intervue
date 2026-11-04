package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.CandidateLanguage;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.mappers.CandidateLanguageMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateLanguageRepository;
import com.techx.intervue.modules.candidate.requests.SaveCandidateLanguageRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateLanguageServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CandidateLanguageService implements CandidateLanguageServiceInterface {

    private static final int MAX_ITEMS = 10;

    private final CandidateLanguageRepository languageRepository;
    private final CandidateProfileLookup lookup;
    private final CandidateLanguageMapper mapper;
    private final CandidateTextNormalizer normalizer;
    private final CandidateProfileServiceInterface profileService;

    @Override
    @Transactional
    public CandidateProfileResource create(SaveCandidateLanguageRequest request, Long userId) {
        CandidateProfile profile = lookup.findOrCreateForUpdate(userId);
        lookup.checkLimit(languageRepository.countByCandidateProfileId(profile.getId()), MAX_ITEMS);
        requireUnique(profile.getId(), null, request.language());

        CandidateLanguage language = CandidateLanguage.builder().candidateProfile(profile).build();
        mapper.apply(language, request);
        languageRepository.save(language);
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource update(
            Long id, SaveCandidateLanguageRequest request, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        CandidateLanguage language = requireOwned(profile, id);
        requireUnique(profile.getId(), id, request.language());
        mapper.apply(language, request);
        languageRepository.save(language);
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource delete(Long id, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        languageRepository.delete(requireOwned(profile, id));
        return profileService.getMine(userId);
    }

    private CandidateLanguage requireOwned(CandidateProfile profile, Long id) {
        return languageRepository
                .findByIdAndCandidateProfileId(id, profile.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private void requireUnique(Long profileId, Long excludedId, String value) {
        for (CandidateLanguage existing :
                languageRepository.findByCandidateProfileIdOrderByLanguageAsc(profileId)) {
            if (!existing.getId().equals(excludedId)
                    && normalizer.sameText(existing.getLanguage(), value)) {
                throw AppException.validation("language", "You already added this language");
            }
        }
    }
}
