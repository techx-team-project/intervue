package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.CandidateCertification;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.events.CandidateAssetsDiscardedEvent;
import com.techx.intervue.modules.candidate.mappers.CandidateCertificationMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateCertificationRepository;
import com.techx.intervue.modules.candidate.requests.SaveCandidateCertificationRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateCertificationServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CandidateCertificationService implements CandidateCertificationServiceInterface {

    private static final int MAX_ITEMS = 20;
    private static final String IMAGE_FOLDER = "candidate-certifications";

    private final CandidateCertificationRepository certificationRepository;
    private final CandidateProfileLookup lookup;
    private final CandidateCertificationMapper mapper;
    private final CandidateProfileServiceInterface profileService;
    private final StorageServiceInterface storageService;
    private final CandidateImageCleaner imageCleaner;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public CandidateProfileResource create(SaveCandidateCertificationRequest request, Long userId) {
        CandidateProfile profile = lookup.findOrCreateForUpdate(userId);
        lookup.checkLimit(
                certificationRepository.countByCandidateProfileId(profile.getId()), MAX_ITEMS);

        CandidateCertification certification =
                CandidateCertification.builder().candidateProfile(profile).build();
        mapper.apply(certification, request);
        certificationRepository.save(certification);
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource update(
            Long id, SaveCandidateCertificationRequest request, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        CandidateCertification certification = requireOwned(profile, id);
        mapper.apply(certification, request);
        certificationRepository.save(certification);
        return profileService.getMine(userId);
    }

    @Override
    @Transactional
    public CandidateProfileResource delete(Long id, Long userId) {
        CandidateProfile profile = lookup.requireForUpdate(userId);
        CandidateCertification certification = requireOwned(profile, id);
        String imagePublicId = certification.getImagePublicId();
        certificationRepository.delete(certification);
        if (imagePublicId != null) {
            eventPublisher.publishEvent(new CandidateAssetsDiscardedEvent(List.of(imagePublicId)));
        }
        return profileService.getMine(userId);
    }

    // Deliberately not transactional: uploading to Cloudinary is an external call and must not
    // hold a database transaction open. Each repository call below runs in its own transaction.
    @Override
    public CandidateProfileResource replaceImage(Long id, MultipartFile file, Long userId) {
        CandidateCertification certification = requireOwned(lookup.require(userId), id);
        String previous = certification.getImagePublicId();

        StoredFile stored = storageService.upload(file, StorageTarget.IMAGE, IMAGE_FOLDER);
        certification.setImagePublicId(stored.publicId());
        return saveImageChange(certification, previous, stored.publicId(), userId);
    }

    @Override
    public CandidateProfileResource removeImage(Long id, Long userId) {
        CandidateCertification certification = requireOwned(lookup.require(userId), id);
        String previous = certification.getImagePublicId();
        if (previous == null) {
            return profileService.getMine(userId);
        }
        certification.setImagePublicId(null);
        return saveImageChange(certification, previous, null, userId);
    }

    private CandidateProfileResource saveImageChange(
            CandidateCertification certification, String previous, String uploaded, Long userId) {
        try {
            certificationRepository.save(certification);
        } catch (RuntimeException e) {
            imageCleaner.deleteQuietly(uploaded);
            throw e;
        }
        imageCleaner.deleteQuietly(previous);
        return profileService.getMine(userId);
    }

    private CandidateCertification requireOwned(CandidateProfile profile, Long id) {
        return certificationRepository
                .findByIdAndCandidateProfileId(id, profile.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
}
