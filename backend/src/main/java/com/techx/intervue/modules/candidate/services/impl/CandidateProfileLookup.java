package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CandidateProfileLookup {

    private final CandidateProfileRepository profileRepository;

    public CandidateProfile findOrCreateForUpdate(Long userId) {
        return profileRepository
                .findByUserIdForUpdate(userId)
                .orElseGet(
                        () ->
                                profileRepository.save(
                                        CandidateProfile.builder().userId(userId).build()));
    }

    public CandidateProfile requireForUpdate(Long userId) {
        return profileRepository
                .findByUserIdForUpdate(userId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    public CandidateProfile require(Long userId) {
        return profileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    public void checkLimit(long existing, int max) {
        if (existing >= max) {
            throw new AppException(ErrorCode.PROFILE_SECTION_LIMIT_REACHED);
        }
    }
}
