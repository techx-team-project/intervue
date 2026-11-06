package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.entities.CandidateResume;
import com.techx.intervue.modules.candidate.events.CandidateResumeDiscardedEvent;
import com.techx.intervue.modules.candidate.mappers.CandidateResumeMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateResumeRepository;
import com.techx.intervue.modules.candidate.resources.CandidateResumeResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CandidateResumeService implements CandidateResumeServiceInterface {

    private static final int MAX_RESUMES = 3;
    private static final String RESUME_FOLDER = "candidates/resumes";

    private final CandidateResumeRepository resumeRepository;
    private final CandidateProfileRepository profileRepository;
    private final CandidateProfileLookup profileLookup;
    private final CandidateResumeMapper resumeMapper;
    private final CvPdfValidator pdfValidator;
    private final StorageServiceInterface storageService;
    private final ApplicationEventPublisher eventPublisher;
    private final TransactionTemplate transaction;

    @Override
    public List<CandidateResumeResource> findAll(Long userId) {
        return transaction.execute(
                status ->
                        profileRepository
                                .findByUserId(userId)
                                .map(
                                        profile ->
                                                resumeRepository
                                                        .findByCandidateProfileIdOrderByCreatedAtDesc(
                                                                profile.getId())
                                                        .stream()
                                                        .map(resumeMapper::toResource)
                                                        .toList())
                                .orElse(List.of()));
    }

    // Not wrapped in one transaction: the Cloudinary upload is an external call.
    @Override
    public CandidateResumeResource upload(MultipartFile file, Long userId) {
        pdfValidator.validate(file);
        transaction.executeWithoutResult(status -> requireRoom(lockProfile(userId)));

        StoredFile stored = storageService.upload(file, StorageTarget.RESUME, RESUME_FOLDER);
        try {
            return transaction.execute(status -> save(lockProfile(userId), stored));
        } catch (RuntimeException e) {
            storageService.delete(stored.publicId(), StorageTarget.RESUME);
            throw e;
        }
    }

    @Override
    public CandidateResumeResource rename(Long resumeId, String fileName, Long userId) {
        return transaction.execute(
                status -> {
                    CandidateResume resume = requireOwned(resumeId, userId);
                    resume.setFileName(fileName.trim());
                    return resumeMapper.toResource(resumeRepository.save(resume));
                });
    }

    @Override
    public CandidateResumeResource setDefault(Long resumeId, Long userId) {
        return transaction.execute(
                status -> {
                    CandidateProfile profile = lockProfile(userId);
                    CandidateResume target = requireOwned(resumeId, profile);
                    resumeRepository
                            .findByCandidateProfileIdAndIsDefaultTrue(profile.getId())
                            .filter(current -> !current.getId().equals(target.getId()))
                            .ifPresent(current -> current.setDefault(false));
                    target.setDefault(true);
                    return resumeMapper.toResource(resumeRepository.save(target));
                });
    }

    @Override
    public void delete(Long resumeId, Long userId) {
        transaction.executeWithoutResult(
                status -> {
                    CandidateProfile profile = lockProfile(userId);
                    CandidateResume resume = requireOwned(resumeId, profile);
                    resumeRepository.delete(resume);
                    resumeRepository.flush();
                    if (resume.isDefault()) {
                        resumeRepository
                                .findByCandidateProfileIdOrderByCreatedAtDesc(profile.getId())
                                .stream()
                                .findFirst()
                                .ifPresent(next -> next.setDefault(true));
                    }
                    eventPublisher.publishEvent(
                            new CandidateResumeDiscardedEvent(resume.getStoragePublicId()));
                });
    }

    @Override
    public ResumeContent download(Long resumeId, Long userId) {
        CandidateResume resume = transaction.execute(status -> requireOwned(resumeId, userId));
        byte[] bytes =
                storageService.fetchDocument(resume.getStoragePublicId(), StorageTarget.RESUME);
        return new ResumeContent(resume.getFileName(), resume.getContentType(), bytes);
    }

    // The copy is made outside any transaction for the same reason as upload.
    @Override
    public ResumeSnapshot copyForApplication(Long resumeId, Long userId, String folder) {
        CandidateResume resume = transaction.execute(status -> requireOwned(resumeId, userId));
        StoredFile copy =
                storageService.copy(
                        resume.getStoragePublicId(),
                        resume.getFileName(),
                        StorageTarget.RESUME,
                        folder);
        return new ResumeSnapshot(
                copy.publicId(), resume.getFileName(), copy.contentType(), copy.sizeInBytes());
    }

    private CandidateProfile lockProfile(Long userId) {
        return profileLookup.findOrCreateForUpdate(userId);
    }

    private void requireRoom(CandidateProfile profile) {
        if (resumeRepository.countByCandidateProfileId(profile.getId()) >= MAX_RESUMES) {
            throw new AppException(ErrorCode.RESUME_LIMIT_REACHED);
        }
    }

    private CandidateResumeResource save(CandidateProfile profile, StoredFile stored) {
        requireRoom(profile);
        boolean first = resumeRepository.countByCandidateProfileId(profile.getId()) == 0;
        CandidateResume resume =
                resumeRepository.save(
                        CandidateResume.builder()
                                .candidateProfile(profile)
                                .fileName(stored.originalFileName())
                                .storagePublicId(stored.publicId())
                                .fileSizeBytes(stored.sizeInBytes())
                                .contentType(stored.contentType())
                                .isDefault(first)
                                .build());
        return resumeMapper.toResource(resume);
    }

    private CandidateResume requireOwned(Long resumeId, Long userId) {
        return requireOwned(resumeId, profileLookup.require(userId));
    }

    private CandidateResume requireOwned(Long resumeId, CandidateProfile profile) {
        return resumeRepository
                .findByIdAndCandidateProfileId(resumeId, profile.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
}
