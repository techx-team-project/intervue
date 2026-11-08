package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.common.taxcode.TaxCodeLookupInterface;
import com.techx.intervue.common.taxcode.TaxCodeRecord;
import com.techx.intervue.common.taxcode.TaxCodes;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.entities.CompanyMember;
import com.techx.intervue.modules.company.entities.CompanyPhoto;
import com.techx.intervue.modules.company.entities.CompanyProfile;
import com.techx.intervue.modules.company.enums.CompanyMemberStatus;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import com.techx.intervue.modules.company.enums.PublishRightLossCause;
import com.techx.intervue.modules.company.events.PublishRightLostEvent;
import com.techx.intervue.modules.company.mappers.CompanyMapper;
import com.techx.intervue.modules.company.repositories.BusinessDocumentRepository;
import com.techx.intervue.modules.company.repositories.CompanyMemberRepository;
import com.techx.intervue.modules.company.repositories.CompanyPhotoRepository;
import com.techx.intervue.modules.company.repositories.CompanyProfileRepository;
import com.techx.intervue.modules.company.repositories.CompanyRepository;
import com.techx.intervue.modules.company.repositories.CompanySpecifications;
import com.techx.intervue.modules.company.requests.CreateCompanyRequest;
import com.techx.intervue.modules.company.requests.JoinCompanyRequest;
import com.techx.intervue.modules.company.requests.SaveCompanyProfileRequest;
import com.techx.intervue.modules.company.requests.SearchCompaniesRequest;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import com.techx.intervue.modules.company.resources.PublicCompanyResource;
import com.techx.intervue.modules.company.resources.TaxLookupResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CompanyService implements CompanyServiceInterface {

    private static final int MAX_PHOTOS = 10;
    private static final int PUBLIC_PROFILE_CANDIDATES = 20;
    private static final String LOGO_FOLDER = "companies/logos";
    private static final String PHOTO_FOLDER = "companies/photos";

    private final CompanyRepository companyRepository;
    private final CompanyMemberRepository companyMemberRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final CompanyPhotoRepository companyPhotoRepository;
    private final BusinessDocumentRepository businessDocumentRepository;
    private final StorageServiceInterface storageService;
    private final RecruiterServiceInterface recruiterService;
    private final TaxCodeLookupInterface taxCodeLookup;
    private final CompanyMapper companyMapper;
    private final CompanyProfileCompleteness completeness;
    private final CompanyLinker companyLinker;
    private final CompanyAuditor companyAuditor;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public CompanyResource findMyCompany(Long userId) {
        return buildResource(requireMembership(userId));
    }

    // Not transactional: the registry lookup is an external call and must not hold a transaction.
    @Override
    public CompanyResource create(CreateCompanyRequest request, RequestActor actor) {
        String taxCode = TaxCodes.normalize(request.taxCode());
        CompanyMember member =
                companyRepository
                        .findByTaxCode(taxCode)
                        .map(existing -> companyLinker.link(existing, actor))
                        .orElseGet(() -> companyLinker.registerAndLink(lookup(taxCode), actor));
        return buildResource(member);
    }

    @Override
    @Transactional
    public CompanyResource update(SaveCompanyProfileRequest request, RequestActor actor) {
        CompanyMember membership = requireMembership(actor.userId());
        CompanyProfile profile = profileOf(membership);
        companyMapper.applyProfile(profile, request);
        companyAuditor.record(actor, AuditAction.COMPANY_UPDATED, membership.getCompany());
        return buildResource(membership, profile);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanySummaryResource> search(SearchCompaniesRequest request, Pageable pageable) {
        return companyRepository
                .findAll(CompanySpecifications.matching(request), pageable)
                .map(companyMapper::toSummaryResource);
    }

    @Override
    public CompanyResource join(JoinCompanyRequest request, RequestActor actor) {
        Company company =
                companyRepository
                        .findById(request.companyId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return buildResource(companyLinker.link(company, actor));
    }

    @Override
    @Transactional
    public void leave(RequestActor actor) {
        if (businessDocumentRepository.existsBySubmittedByAndReviewStatus(
                actor.userId(), DocumentReviewStatus.PENDING_REVIEW)) {
            throw new AppException(ErrorCode.COMPANY_LINK_UNDER_REVIEW);
        }
        CompanyMember membership = requireMembership(actor.userId());
        Company company = membership.getCompany();

        membership.setStatus(CompanyMemberStatus.LEFT);
        membership.setRevokedAt(Instant.now());
        companyMemberRepository.save(membership);
        companyAuditor.record(actor, AuditAction.COMPANY_MEMBER_LEFT, company);
        eventPublisher.publishEvent(
                PublishRightLostEvent.builder()
                        .userId(actor.userId())
                        .companyId(company.getId())
                        .companyName(company.getName())
                        .cause(PublishRightLossCause.MEMBERSHIP_LEFT)
                        .occurredAt(Instant.now())
                        .build());
    }

    // Deliberately not transactional: uploading to Cloudinary is an external call and must not
    // hold a database transaction open. Each repository call below runs in its own transaction.
    @Override
    public CompanyResource replaceLogo(MultipartFile file, Long userId) {
        CompanyMember membership = requireMembership(userId);
        CompanyProfile profile = profileOf(membership);
        String previousLogo = profile.getLogoPublicId();

        StoredFile stored = storageService.upload(file, StorageTarget.IMAGE, LOGO_FOLDER);
        profile.setLogoPublicId(stored.publicId());
        companyProfileRepository.save(profile);

        if (previousLogo != null) {
            storageService.delete(previousLogo, StorageTarget.IMAGE);
        }
        return buildResource(membership, profile);
    }

    @Override
    @Transactional(readOnly = true)
    public TaxLookupResource lookupTax(String taxCode) {
        TaxCodeRecord record = lookup(taxCode);
        Optional<Company> existing = companyRepository.findByTaxCode(record.taxCode());
        return TaxLookupResource.builder()
                .taxCode(record.taxCode())
                .name(record.name())
                .address(record.address())
                .existingOnPlatform(existing.isPresent())
                .existingCompanyId(existing.map(Company::getId).orElse(null))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CompanySummaryResource findSummary(Long companyId) {
        return companyRepository
                .findById(companyId)
                .map(companyMapper::toSummaryResource)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveMemberWithEmail(Long companyId, String email) {
        List<Long> memberIds =
                companyMemberRepository
                        .findByCompanyIdAndStatus(companyId, CompanyMemberStatus.ACTIVE)
                        .stream()
                        .map(CompanyMember::getUserId)
                        .toList();
        return recruiterService.findByIds(memberIds).stream()
                .anyMatch(recruiter -> recruiter.email().equalsIgnoreCase(email));
    }

    @Override
    @Transactional(readOnly = true)
    public PublicCompanyResource findPublic(Long companyId) {
        Company company =
                companyRepository
                        .findById(companyId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        List<CompanyProfile> candidates =
                companyProfileRepository.findByCompanyAndMemberStatus(
                        companyId,
                        CompanyMemberStatus.ACTIVE,
                        PageRequest.of(0, PUBLIC_PROFILE_CANDIDATES));
        CompanyProfile profile =
                candidates.stream()
                        .filter(candidate -> candidate.getDescription() != null)
                        .findFirst()
                        .or(() -> candidates.stream().findFirst())
                        .orElse(null);
        List<CompanyPhoto> photos =
                profile == null
                        ? List.of()
                        : companyPhotoRepository.findByProfileIdOrderBySortOrderAsc(
                                profile.getId());
        return companyMapper.toPublicResource(company, profile, photos);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Long, String> findLogoUrlsByRecruiterIds(Collection<Long> recruiterIds) {
        if (recruiterIds.isEmpty()) {
            return Map.of();
        }
        return companyProfileRepository.findWithLogoByRecruiterIds(recruiterIds).stream()
                .collect(
                        Collectors.toMap(
                                profile -> profile.getMember().getUserId(),
                                profile -> storageService.publicImageUrl(profile.getLogoPublicId()),
                                (first, second) -> first));
    }

    @Override
    public CompanyResource addPhotos(List<MultipartFile> files, Long userId) {
        CompanyMember membership = requireMembership(userId);
        CompanyProfile profile = profileOf(membership);

        long existing = companyPhotoRepository.countByProfileId(profile.getId());
        if (existing + files.size() > MAX_PHOTOS) {
            throw AppException.validation(
                    "photos", "A company can keep at most " + MAX_PHOTOS + " photos");
        }

        int sortOrder = (int) existing;
        for (MultipartFile file : files) {
            StoredFile stored = storageService.upload(file, StorageTarget.IMAGE, PHOTO_FOLDER);
            companyPhotoRepository.save(
                    CompanyPhoto.builder()
                            .profile(profile)
                            .publicId(stored.publicId())
                            .sortOrder(sortOrder++)
                            .build());
        }
        return buildResource(membership, profile);
    }

    @Override
    public CompanyResource removePhoto(Long photoId, Long userId) {
        CompanyMember membership = requireMembership(userId);
        CompanyProfile profile = profileOf(membership);

        CompanyPhoto photo =
                companyPhotoRepository
                        .findByIdAndProfileId(photoId, profile.getId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        String publicId = photo.getPublicId();
        companyPhotoRepository.delete(photo);
        storageService.delete(publicId, StorageTarget.IMAGE);
        return buildResource(membership, profile);
    }

    private TaxCodeRecord lookup(String taxCode) {
        return taxCodeLookup
                .find(taxCode)
                .orElseThrow(() -> new AppException(ErrorCode.TAX_CODE_NOT_FOUND));
    }

    private CompanyMember requireMembership(Long userId) {
        return companyMemberRepository
                .findActiveWithCompany(userId, CompanyMemberStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private CompanyProfile profileOf(CompanyMember membership) {
        return companyProfileRepository
                .findByMemberId(membership.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private CompanyResource buildResource(CompanyMember membership) {
        return buildResource(membership, profileOf(membership));
    }

    private CompanyResource buildResource(CompanyMember membership, CompanyProfile profile) {
        List<CompanyPhoto> photos =
                companyPhotoRepository.findByProfileIdOrderBySortOrderAsc(profile.getId());
        return companyMapper.toResource(
                membership.getCompany(), profile, photos, completeness.missingFields(profile));
    }
}
