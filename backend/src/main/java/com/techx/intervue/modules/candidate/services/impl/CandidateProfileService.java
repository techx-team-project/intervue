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
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.text.CollationKey;
import java.text.Collator;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.TreeSet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateProfileService implements CandidateProfileServiceInterface {

    private static final String AVATAR_FOLDER = "candidate-avatars";
    private static final String COVER_FOLDER = "candidate-covers";

    private final CandidateProfileRepository profileRepository;
    private final CandidatePreferredLocationRepository locationRepository;
    private final CandidatePreferredIndustryRepository industryRepository;
    private final UserServiceInterface userService;
    private final StorageServiceInterface storageService;
    private final CandidateProfileMapper profileMapper;

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
            deleteQuietly(uploaded);
            throw e;
        }
        deleteQuietly(previous);
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
                normalizeValues(request.preferredLocations()).stream()
                        .map(
                                city ->
                                        CandidatePreferredLocation.builder()
                                                .candidateProfile(profile)
                                                .city(city)
                                                .build())
                        .toList());
        industryRepository.saveAll(
                normalizeValues(request.preferredIndustries()).stream()
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
            return profileMapper.toResource(profile, user, List.of(), List.of());
        }
        return profileMapper.toResource(
                profile,
                user,
                locationRepository.findByCandidateProfileIdOrderByCityAsc(profile.getId()),
                industryRepository.findByCandidateProfileIdOrderByIndustryAsc(profile.getId()));
    }

    private List<String> normalizeValues(Collection<String> values) {
        List<String> kept = new ArrayList<>();
        if (values == null) {
            return kept;
        }
        Collator collator = Collator.getInstance(Locale.ROOT);
        collator.setStrength(Collator.PRIMARY);
        Set<CollationKey> seen = new TreeSet<>();
        for (String value : values) {
            if (value == null) {
                continue;
            }
            String trimmed = value.trim();
            if (!trimmed.isEmpty() && seen.add(collator.getCollationKey(foldKey(trimmed)))) {
                kept.add(trimmed);
            }
        }
        return kept;
    }

    private String foldKey(String value) {
        return Normalizer.normalize(value, Normalizer.Form.NFKD)
                .replaceAll("\\p{M}+", "")
                .replace('đ', 'd')
                .replace('Đ', 'D')
                .toLowerCase(Locale.ROOT);
    }

    private void deleteQuietly(String publicId) {
        if (publicId == null) {
            return;
        }
        try {
            storageService.delete(publicId, StorageTarget.IMAGE);
        } catch (RuntimeException e) {
            log.warn("Could not delete stored image {}: {}", publicId, e.getMessage());
        }
    }
}
