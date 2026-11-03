package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.entities.CompanyMember;
import com.techx.intervue.modules.company.entities.CompanyPhoto;
import com.techx.intervue.modules.company.enums.CompanyMemberRole;
import com.techx.intervue.modules.company.enums.CompanyMemberStatus;
import com.techx.intervue.modules.company.events.CompanyAssetsDiscardedEvent;
import com.techx.intervue.modules.company.mappers.CompanyMapper;
import com.techx.intervue.modules.company.repositories.BusinessDocumentRepository;
import com.techx.intervue.modules.company.repositories.CompanyMemberRepository;
import com.techx.intervue.modules.company.repositories.CompanyPhotoRepository;
import com.techx.intervue.modules.company.repositories.CompanyRepository;
import com.techx.intervue.modules.company.repositories.CompanySpecifications;
import com.techx.intervue.modules.company.requests.JoinCompanyRequest;
import com.techx.intervue.modules.company.requests.SaveCompanyProfileRequest;
import com.techx.intervue.modules.company.requests.SearchCompaniesRequest;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CompanyService implements CompanyServiceInterface {

    private static final int MAX_PHOTOS = 10;
    private static final String LOGO_FOLDER = "companies/logos";
    private static final String PHOTO_FOLDER = "companies/photos";

    private final CompanyRepository companyRepository;
    private final CompanyMemberRepository companyMemberRepository;
    private final CompanyPhotoRepository companyPhotoRepository;
    private final BusinessDocumentRepository businessDocumentRepository;
    private final StorageServiceInterface storageService;
    private final CompanyMapper companyMapper;
    private final CompanyProfileCompleteness completeness;
    private final AuditLogServiceInterface auditLogService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public CompanyResource findMyCompany(Long userId) {
        CompanyMember membership = requireMembership(userId);
        return buildResource(membership.getCompany(), membership.getRole());
    }

    @Override
    @Transactional
    public CompanyResource create(SaveCompanyProfileRequest request, RecruiterActor actor) {
        requireNoMembership(actor.userId());
        if (companyRepository.existsByTaxCode(request.taxCode())) {
            throw new AppException(ErrorCode.TAX_CODE_ALREADY_USED);
        }

        Company company = companyRepository.save(companyMapper.toNewEntity(request));
        companyMemberRepository.save(
                CompanyMember.builder()
                        .company(company)
                        .userId(actor.userId())
                        .role(CompanyMemberRole.OWNER)
                        .status(CompanyMemberStatus.ACTIVE)
                        .joinedAt(Instant.now())
                        .build());

        audit(actor, AuditAction.COMPANY_CREATED, company);
        return buildResource(company, CompanyMemberRole.OWNER);
    }

    @Override
    @Transactional
    public CompanyResource update(SaveCompanyProfileRequest request, RecruiterActor actor) {
        CompanyMember membership = requireMembership(actor.userId());
        Company company = membership.getCompany();

        if (changesLegalFields(company, request)) {
            if (!membership.isOwner()) {
                throw new AppException(ErrorCode.ONLY_OWNER_CAN_EDIT_LEGAL_FIELDS);
            }
            if (company.isVerified()) {
                throw new AppException(ErrorCode.COMPANY_LEGAL_FIELDS_LOCKED);
            }
            if (!Objects.equals(company.getTaxCode(), request.taxCode())
                    && companyRepository.existsByTaxCode(request.taxCode())) {
                throw new AppException(ErrorCode.TAX_CODE_ALREADY_USED);
            }
        }

        companyMapper.applyUpdate(company, request);
        audit(actor, AuditAction.COMPANY_UPDATED, company);
        return buildResource(company, membership.getRole());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanySummaryResource> search(SearchCompaniesRequest request, Pageable pageable) {
        return companyRepository
                .findAll(CompanySpecifications.matching(request), pageable)
                .map(companyMapper::toSummaryResource);
    }

    @Override
    @Transactional
    public CompanyResource join(JoinCompanyRequest request, RecruiterActor actor) {
        Company company =
                companyRepository
                        .findById(request.companyId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        Optional<CompanyMember> previous =
                companyMemberRepository.findByCompanyIdAndUserId(company.getId(), actor.userId());
        if (previous.isPresent()) {
            switch (previous.get().getStatus()) {
                case ACTIVE -> throw new AppException(ErrorCode.ALREADY_COMPANY_MEMBER);
                case REVOKED -> throw new AppException(ErrorCode.COMPANY_MEMBERSHIP_REVOKED);
                case LEFT -> {
                    /* rejoining is allowed below */
                }
            }
        }
        requireNoMembership(actor.userId());

        CompanyMember member =
                previous.orElseGet(
                        () ->
                                CompanyMember.builder()
                                        .company(company)
                                        .userId(actor.userId())
                                        .build());
        member.setRole(CompanyMemberRole.MEMBER);
        member.setStatus(CompanyMemberStatus.ACTIVE);
        member.setJoinedAt(Instant.now());
        member.setRevokedAt(null);
        member.setRevokedBy(null);
        member.setRevokeReason(null);
        companyMemberRepository.save(member);

        audit(actor, AuditAction.COMPANY_MEMBER_JOINED, company);
        return buildResource(company, CompanyMemberRole.MEMBER);
    }

    @Override
    @Transactional
    public void leave(RecruiterActor actor) {
        CompanyMember membership = requireMembership(actor.userId());
        Company company = membership.getCompany();

        if (membership.isOwner() && isLastOwner(company.getId())) {
            if (hasOtherActiveMembers(company.getId())
                    || company.isVerified()
                    || businessDocumentRepository.existsByCompanyId(company.getId())) {
                throw new AppException(ErrorCode.LAST_COMPANY_OWNER);
            }
            discardCompany(company, actor);
            return;
        }

        membership.setStatus(CompanyMemberStatus.LEFT);
        membership.setRevokedAt(Instant.now());
        companyMemberRepository.save(membership);
        audit(actor, AuditAction.COMPANY_MEMBER_LEFT, company);
    }

    // Deliberately not transactional: uploading to Cloudinary is an external call and must not
    // hold a database transaction open. Each repository call below runs in its own transaction.
    @Override
    public CompanyResource replaceLogo(MultipartFile file, Long userId) {
        CompanyMember membership = requireMembership(userId);
        Company company = membership.getCompany();
        String previousLogo = company.getLogoPublicId();

        StoredFile stored = storageService.upload(file, StorageTarget.IMAGE, LOGO_FOLDER);
        company.setLogoPublicId(stored.publicId());
        companyRepository.save(company);

        if (previousLogo != null) {
            storageService.delete(previousLogo, StorageTarget.IMAGE);
        }
        return buildResource(company, membership.getRole());
    }

    @Override
    public CompanyResource addPhotos(List<MultipartFile> files, Long userId) {
        CompanyMember membership = requireMembership(userId);
        Company company = membership.getCompany();

        long existing = companyPhotoRepository.countByCompanyId(company.getId());
        if (existing + files.size() > MAX_PHOTOS) {
            throw AppException.validation(
                    "photos", "A company can keep at most " + MAX_PHOTOS + " photos");
        }

        int sortOrder = (int) existing;
        for (MultipartFile file : files) {
            StoredFile stored = storageService.upload(file, StorageTarget.IMAGE, PHOTO_FOLDER);
            companyPhotoRepository.save(
                    CompanyPhoto.builder()
                            .company(company)
                            .publicId(stored.publicId())
                            .sortOrder(sortOrder++)
                            .build());
        }
        return buildResource(company, membership.getRole());
    }

    @Override
    public CompanyResource removePhoto(Long photoId, Long userId) {
        CompanyMember membership = requireMembership(userId);
        Company company = membership.getCompany();

        CompanyPhoto photo =
                companyPhotoRepository
                        .findByIdAndCompanyId(photoId, company.getId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        String publicId = photo.getPublicId();
        companyPhotoRepository.delete(photo);
        storageService.delete(publicId, StorageTarget.IMAGE);
        return buildResource(company, membership.getRole());
    }

    private CompanyMember requireMembership(Long userId) {
        return companyMemberRepository
                .findActiveWithCompany(userId, CompanyMemberStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private void requireNoMembership(Long userId) {
        if (companyMemberRepository.existsByUserIdAndStatus(userId, CompanyMemberStatus.ACTIVE)) {
            throw new AppException(ErrorCode.ALREADY_IN_ANOTHER_COMPANY);
        }
    }

    private boolean isLastOwner(Long companyId) {
        return companyMemberRepository.countByCompanyIdAndRoleAndStatus(
                        companyId, CompanyMemberRole.OWNER, CompanyMemberStatus.ACTIVE)
                <= 1;
    }

    private boolean hasOtherActiveMembers(Long companyId) {
        return companyMemberRepository.countByCompanyIdAndStatus(
                        companyId, CompanyMemberStatus.ACTIVE)
                > 1;
    }

    // The owner is leaving a company nobody else uses and no document was ever filed for, so the
    // record is a mistake: removing it frees the tax code instead of leaving an unreachable
    // company.
    private void discardCompany(Company company, RecruiterActor actor) {
        List<CompanyPhoto> photos =
                companyPhotoRepository.findByCompanyIdOrderBySortOrderAsc(company.getId());
        List<String> storedImages = new ArrayList<>();
        if (company.getLogoPublicId() != null) {
            storedImages.add(company.getLogoPublicId());
        }
        photos.forEach(photo -> storedImages.add(photo.getPublicId()));

        // Children must be deleted and flushed first: rows already loaded in this session still
        // point at the company, and Hibernate rejects the flush before the database cascade runs.
        companyPhotoRepository.deleteAll(photos);
        companyMemberRepository.deleteAll(companyMemberRepository.findByCompanyId(company.getId()));
        companyMemberRepository.flush();
        companyRepository.delete(company);
        audit(actor, AuditAction.COMPANY_DELETED, company);
        if (!storedImages.isEmpty()) {
            eventPublisher.publishEvent(new CompanyAssetsDiscardedEvent(storedImages));
        }
    }

    private boolean changesLegalFields(Company company, SaveCompanyProfileRequest request) {
        return !Objects.equals(company.getName(), request.name())
                || !Objects.equals(company.getTaxCode(), request.taxCode())
                || !Objects.equals(company.getBusinessType(), request.businessType())
                || !Objects.equals(company.getAddress(), request.address());
    }

    private CompanyResource buildResource(Company company, CompanyMemberRole myRole) {
        List<CompanyPhoto> photos =
                companyPhotoRepository.findByCompanyIdOrderBySortOrderAsc(company.getId());
        return companyMapper.toResource(
                company, myRole, photos, completeness.missingFields(company));
    }

    private void audit(RecruiterActor actor, AuditAction action, Company company) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.USER)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.COMPANY)
                        .targetId(company.getId())
                        .detail(company.getName())
                        .ip(actor.ip())
                        .build());
    }
}
