package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.mappers.CandidateProfileMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.candidate.requests.SaveCandidateProfileRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.text.Collator;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.BiConsumer;
import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateProfileService implements CandidateProfileServiceInterface {

    private enum ImageSlot {
        AVATAR(
                "candidate-avatars",
                CandidateProfile::getAvatarPublicId,
                CandidateProfile::setAvatarPublicId),
        COVER(
                "candidate-covers",
                CandidateProfile::getCoverPublicId,
                CandidateProfile::setCoverPublicId);

        private final String folder;
        private final Function<CandidateProfile, String> reader;
        private final BiConsumer<CandidateProfile, String> writer;

        ImageSlot(
                String folder,
                Function<CandidateProfile, String> reader,
                BiConsumer<CandidateProfile, String> writer) {
            this.folder = folder;
            this.reader = reader;
            this.writer = writer;
        }
    }

    private record ImageChange(String previousPublicId, CandidateProfileResource resource) {}

    private final CandidateProfileRepository profileRepository;
    private final UserServiceInterface userService;
    private final StorageServiceInterface storageService;
    private final CandidateProfileMapper profileMapper;
    private final TransactionTemplate transactionTemplate;

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResource getMine(Long userId) {
        return profileMapper.toResource(findOrNew(userId), userService.getMe(userId));
    }

    @Override
    @Transactional
    public CandidateProfileResource updateMine(Long userId, SaveCandidateProfileRequest request) {
        userService.updateBasicInfo(userId, request.name(), request.address());

        CandidateProfile profile = findOrNew(userId);
        profileMapper.applyUpdate(profile, request);
        replaceValues(profile.getPreferredLocations(), request.preferredLocations());
        replaceValues(profile.getPreferredIndustries(), request.preferredIndustries());
        return profileMapper.toResource(flush(profile), userService.getMe(userId));
    }

    @Override
    public CandidateProfileResource replaceAvatar(MultipartFile file, Long userId) {
        return replaceImage(file, userId, ImageSlot.AVATAR);
    }

    @Override
    public CandidateProfileResource removeAvatar(Long userId) {
        return removeImage(userId, ImageSlot.AVATAR);
    }

    @Override
    public CandidateProfileResource replaceCover(MultipartFile file, Long userId) {
        return replaceImage(file, userId, ImageSlot.COVER);
    }

    @Override
    public CandidateProfileResource removeCover(Long userId) {
        return removeImage(userId, ImageSlot.COVER);
    }

    // Not transactional: the upload must not hold a database transaction open.
    // database transaction open.
    private CandidateProfileResource replaceImage(MultipartFile file, Long userId, ImageSlot slot) {
        StoredFile stored = storageService.upload(file, StorageTarget.IMAGE, slot.folder);
        ImageChange change;
        try {
            change =
                    transactionTemplate.execute(
                            status -> {
                                CandidateProfile profile = findOrNew(userId);
                                String previous = slot.reader.apply(profile);
                                slot.writer.accept(profile, stored.publicId());
                                return saveChange(profile, previous, userId);
                            });
        } catch (RuntimeException e) {
            deleteQuietly(stored.publicId());
            throw e;
        }
        deleteQuietly(change.previousPublicId());
        return change.resource();
    }

    private CandidateProfileResource removeImage(Long userId, ImageSlot slot) {
        ImageChange change =
                transactionTemplate.execute(
                        status -> {
                            CandidateProfile profile = findOrNew(userId);
                            String previous = slot.reader.apply(profile);
                            if (previous == null) {
                                return new ImageChange(
                                        null,
                                        profileMapper.toResource(
                                                profile, userService.getMe(userId)));
                            }
                            slot.writer.accept(profile, null);
                            return saveChange(profile, previous, userId);
                        });
        deleteQuietly(change.previousPublicId());
        return change.resource();
    }

    private ImageChange saveChange(CandidateProfile profile, String previous, Long userId) {
        CandidateProfile saved = profileRepository.save(profile);
        return new ImageChange(
                previous, profileMapper.toResource(saved, userService.getMe(userId)));
    }

    private CandidateProfile findOrNew(Long userId) {
        return profileRepository
                .findByUserId(userId)
                .orElseGet(() -> CandidateProfile.builder().userId(userId).build());
    }

    private CandidateProfile flush(CandidateProfile profile) {
        try {
            return profileRepository.saveAndFlush(profile);
        } catch (DataIntegrityViolationException e) {
            throw AppException.validation(
                    "preferredLocations", "Preferred locations and industries must be unique");
        }
    }

    private void replaceValues(Set<String> target, Collection<String> incoming) {
        target.clear();
        target.addAll(normalizeValues(incoming));
    }

    private Collection<String> normalizeValues(Collection<String> values) {
        if (values == null) {
            return List.of();
        }
        Collator collator = Collator.getInstance(Locale.ROOT);
        collator.setStrength(Collator.PRIMARY);
        Set<String> seenKeys = new TreeSet<>(collator);
        List<String> kept = new ArrayList<>();
        for (String value : values) {
            if (value == null) {
                continue;
            }
            String trimmed = value.trim();
            if (!trimmed.isEmpty() && seenKeys.add(foldKey(trimmed))) {
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
