package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.modules.candidate.entities.CandidatePreferredIndustry;
import com.techx.intervue.modules.candidate.entities.CandidatePreferredLocation;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.mappers.CandidateProfileMapper;
import com.techx.intervue.modules.candidate.repositories.CandidatePreferredIndustryRepository;
import com.techx.intervue.modules.candidate.repositories.CandidatePreferredLocationRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.candidate.requests.SaveCandidateProfileRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.resources.CandidateProfileSectionsResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CandidateProfileService implements CandidateProfileServiceInterface {

    private static final String AVATAR_FOLDER = "candidate-avatars";
    private static final String COVER_FOLDER = "candidate-covers";

    private final CandidateProfileRepository profileRepository;
    private final CandidatePreferredLocationRepository locationRepository;
    private final CandidatePreferredIndustryRepository industryRepository;
    private final UserServiceInterface userService;
    private final StorageServiceInterface storageService;
    private final CandidateProfileMapper profileMapper;
    private final CandidateTextNormalizer normalizer;
    private final CandidateProfileSectionsLoader sectionsLoader;
    private final CandidateImageCleaner imageCleaner;

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResource getMine(Long userId) {
        return buildResource(findOrNew(userId), userService.getMe(userId));
    }

    @Override
    @Transactional
    public CandidateProfileResource updateMine(Long userId, SaveCandidateProfileRequest request) {
        CandidateProfile profile = findOrNew(userId);
        userService.updateBasicInfo(userId, request.name(), request.address());

        profileMapper.applyUpdate(profile, request);
        CandidateProfile saved = profileRepository.saveAndFlush(profile);
        replacePreferences(saved, request);
        return buildResource(saved, userService.getMe(userId));
    }

    // Deliberately not transactional: uploading to Cloudinary is an external call and must not
    // hold a database transaction open. Each repository call below runs in its own transaction.
    @Override
    public CandidateProfileResource replaceAvatar(MultipartFile file, Long userId) {
        CandidateProfile profile = findOrNew(userId);
        String previous = profile.getAvatarPublicId();

        StoredFile stored = storageService.upload(file, StorageTarget.IMAGE, AVATAR_FOLDER);
        profile.setAvatarPublicId(stored.publicId());
        return saveImageChange(profile, previous, stored.publicId(), userId);
    }

    @Override
    public CandidateProfileResource replaceCover(MultipartFile file, Long userId) {
        CandidateProfile profile = findOrNew(userId);
        String previous = profile.getCoverPublicId();

        StoredFile stored = storageService.upload(file, StorageTarget.IMAGE, COVER_FOLDER);
        profile.setCoverPublicId(stored.publicId());
        return saveImageChange(profile, previous, stored.publicId(), userId);
    }

    @Override
    public CandidateProfileResource removeAvatar(Long userId) {
        CandidateProfile profile = findOrNew(userId);
        String previous = profile.getAvatarPublicId();
        if (previous == null) {
            return buildResource(profile, userService.getMe(userId));
        }
        profile.setAvatarPublicId(null);
        return saveImageChange(profile, previous, null, userId);
    }

    @Override
    public CandidateProfileResource removeCover(Long userId) {
        CandidateProfile profile = findOrNew(userId);
        String previous = profile.getCoverPublicId();
        if (previous == null) {
            return buildResource(profile, userService.getMe(userId));
        }
        profile.setCoverPublicId(null);
        return saveImageChange(profile, previous, null, userId);
    }

    private CandidateProfileResource saveImageChange(
            CandidateProfile profile, String previous, String uploaded, Long userId) {
        CandidateProfile saved;
        try {
            saved = profileRepository.save(profile);
        } catch (RuntimeException e) {
            imageCleaner.deleteQuietly(uploaded);
            throw e;
        }
        imageCleaner.deleteQuietly(previous);
        return buildResource(saved, userService.getMe(userId));
    }

    private CandidateProfile findOrNew(Long userId) {
        return profileRepository
                .findByUserId(userId)
                .orElseGet(() -> CandidateProfile.builder().userId(userId).build());
    }

    private void replacePreferences(CandidateProfile profile, SaveCandidateProfileRequest request) {
        Long profileId = profile.getId();
        locationRepository.deleteByCandidateProfileId(profileId);
        industryRepository.deleteByCandidateProfileId(profileId);
        locationRepository.saveAll(
                normalizer.normalizeValues(request.preferredLocations()).stream()
                        .map(
                                city ->
                                        CandidatePreferredLocation.builder()
                                                .candidateProfile(profile)
                                                .city(city)
                                                .build())
                        .toList());
        industryRepository.saveAll(
                normalizer.normalizeValues(request.preferredIndustries()).stream()
                        .map(
                                industry ->
                                        CandidatePreferredIndustry.builder()
                                                .candidateProfile(profile)
                                                .industry(industry)
                                                .build())
                        .toList());
    }

    private CandidateProfileResource buildResource(CandidateProfile profile, UserResource user) {
        if (profile.getId() == null) {
            return profileMapper.toResource(
                    profile, user, List.of(), List.of(), CandidateProfileSectionsResource.empty());
        }
        return profileMapper.toResource(
                profile,
                user,
                locationRepository.findByCandidateProfileIdOrderByCityAsc(profile.getId()),
                industryRepository.findByCandidateProfileIdOrderByIndustryAsc(profile.getId()),
                sectionsLoader.load(profile.getId()));
    }
}
