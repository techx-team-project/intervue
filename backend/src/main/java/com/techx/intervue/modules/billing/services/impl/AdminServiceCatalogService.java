package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ads.repositories.AdSlotRepository;
import com.techx.intervue.modules.billing.entities.ServiceCategory;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.entities.ServicePackageBenefit;
import com.techx.intervue.modules.billing.entities.ServicePackageSection;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import com.techx.intervue.modules.billing.mappers.ServicePackageMapper;
import com.techx.intervue.modules.billing.repositories.ServiceCategoryRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageBenefitRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository.CategoryPackageCounts;
import com.techx.intervue.modules.billing.repositories.ServicePackageSectionRepository;
import com.techx.intervue.modules.billing.requests.AdminSearchServicePackagesRequest;
import com.techx.intervue.modules.billing.requests.ReorderServiceCategoriesRequest;
import com.techx.intervue.modules.billing.requests.SaveServiceCategoryRequest;
import com.techx.intervue.modules.billing.requests.SaveServicePackageRequest;
import com.techx.intervue.modules.billing.resources.AdminServiceCategoryResource;
import com.techx.intervue.modules.billing.resources.AdminServicePackageResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminServiceCatalogServiceInterface;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AdminServiceCatalogService implements AdminServiceCatalogServiceInterface {

    private final ServiceCategoryRepository categoryRepository;
    private final ServicePackageRepository packageRepository;
    private final ServicePackageBenefitRepository benefitRepository;
    private final ServicePackageSectionRepository sectionRepository;
    private final AdSlotRepository adSlotRepository;
    private final ServicePackageMapper mapper;
    private final AuditLogServiceInterface auditLogService;
    private final StorageServiceInterface storageService;

    @Override
    @Transactional(readOnly = true)
    public List<AdminServiceCategoryResource> listCategories() {
        Map<Long, CategoryPackageCounts> countsByCategory =
                packageRepository.countPackagesByCategory(ServicePackageStatus.ACTIVE).stream()
                        .collect(
                                Collectors.toMap(
                                        CategoryPackageCounts::getCategoryId, Function.identity()));
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(
                        category -> {
                            CategoryPackageCounts counts = countsByCategory.get(category.getId());
                            long total = counts == null ? 0L : counts.getTotalCount();
                            long active = counts == null ? 0L : counts.getActiveCount();
                            return mapper.toAdminCategoryResource(category, total, active);
                        })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminServiceCategoryResource getCategory(Long id) {
        return toCategoryResource(requireCategory(id));
    }

    @Override
    @Transactional
    public AdminServiceCategoryResource createCategory(
            SaveServiceCategoryRequest request, RequestActor actor) {
        String normalizedCode = request.code().trim().toUpperCase(Locale.ROOT);
        if (categoryRepository.existsByCode(normalizedCode)) {
            throw new AppException(ErrorCode.DUPLICATE_SERVICE_CATEGORY_CODE);
        }
        ServiceCategory category = new ServiceCategory();
        mapper.apply(category, request);
        ServiceCategory saved = categoryRepository.save(category);
        audit(
                actor,
                AuditAction.SERVICE_CATEGORY_CREATED,
                AuditTargetType.SERVICE_CATEGORY,
                saved.getId(),
                saved.getCode());
        return mapper.toAdminCategoryResource(saved, 0L, 0L);
    }

    @Override
    @Transactional
    public AdminServiceCategoryResource updateCategory(
            Long id, SaveServiceCategoryRequest request, RequestActor actor) {
        ServiceCategory category = requireCategory(id);
        String normalizedCode = request.code().trim().toUpperCase(Locale.ROOT);
        if (!normalizedCode.equals(category.getCode())
                && packageRepository.countByCategoryId(id) > 0) {
            throw new AppException(ErrorCode.SERVICE_CATEGORY_CODE_LOCKED);
        }
        if (categoryRepository.existsByCodeAndIdNot(normalizedCode, id)) {
            throw new AppException(ErrorCode.DUPLICATE_SERVICE_CATEGORY_CODE);
        }
        mapper.apply(category, request);
        audit(
                actor,
                AuditAction.SERVICE_CATEGORY_UPDATED,
                AuditTargetType.SERVICE_CATEGORY,
                id,
                category.getCode());
        return toCategoryResource(category);
    }

    @Override
    @Transactional
    public AdminServiceCategoryResource setCategoryActive(
            Long id, boolean active, RequestActor actor) {
        ServiceCategory category = requireCategory(id);
        category.setIsActive(active);
        audit(
                actor,
                AuditAction.SERVICE_CATEGORY_UPDATED,
                AuditTargetType.SERVICE_CATEGORY,
                id,
                category.getCode() + (active ? " -> VISIBLE" : " -> HIDDEN"));
        return toCategoryResource(category);
    }

    @Override
    @Transactional
    public List<AdminServiceCategoryResource> reorderCategories(
            ReorderServiceCategoriesRequest request, RequestActor actor) {
        Set<Long> uniqueIds = new HashSet<>();
        for (ReorderServiceCategoriesRequest.Item item : request.items()) {
            if (!uniqueIds.add(item.id())) {
                throw AppException.validation("items", "Duplicate category id in reorder request.");
            }
        }
        Map<Long, ServiceCategory> byId =
                categoryRepository.findAllById(uniqueIds).stream()
                        .collect(Collectors.toMap(ServiceCategory::getId, Function.identity()));
        if (byId.size() != uniqueIds.size()) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        for (ReorderServiceCategoriesRequest.Item item : request.items()) {
            byId.get(item.id()).setDisplayOrder(item.displayOrder());
        }
        categoryRepository.flush();
        audit(
                actor,
                AuditAction.SERVICE_CATEGORY_REORDERED,
                AuditTargetType.SERVICE_CATEGORY,
                null,
                "Reordered " + request.items().size() + " service categories");
        return listCategories();
    }

    @Override
    @Transactional
    public void deleteCategory(Long id, RequestActor actor) {
        ServiceCategory category = requireCategory(id);
        if (packageRepository.countByCategoryId(id) > 0) {
            throw new AppException(ErrorCode.SERVICE_CATEGORY_IN_USE);
        }
        categoryRepository.delete(category);
        audit(
                actor,
                AuditAction.SERVICE_CATEGORY_DELETED,
                AuditTargetType.SERVICE_CATEGORY,
                id,
                category.getCode());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminServicePackageResource> searchPackages(
            AdminSearchServicePackagesRequest request, Pageable pageable) {
        Page<ServicePackage> page = packageRepository.findAll(toSpecification(request), pageable);
        Map<Long, List<ServicePackageBenefit>> benefits = loadBenefits(page.getContent());
        Map<Long, List<ServicePackageSection>> sections = loadSections(page.getContent());
        return page.map(
                item ->
                        mapper.toAdminPackageResource(
                                item,
                                benefits.getOrDefault(item.getId(), List.of()),
                                sections.getOrDefault(item.getId(), List.of())));
    }

    @Override
    @Transactional(readOnly = true)
    public AdminServicePackageResource getPackage(Long id) {
        return toResource(requirePackage(id));
    }

    @Override
    @Transactional
    public AdminServicePackageResource createPackage(
            SaveServicePackageRequest request, RequestActor actor) {
        if (packageRepository.existsByCode(request.code())
                || packageRepository.existsBySlug(request.slug())) {
            throw new AppException(ErrorCode.DUPLICATE_PACKAGE_CODE);
        }
        validateBenefits(request.benefits());
        ServicePackage servicePackage = new ServicePackage();
        mapper.apply(servicePackage, request, requireCategory(request.categoryId()));
        syncBonusCreditsFromBenefits(servicePackage, request);
        ServicePackage saved = packageRepository.save(servicePackage);
        replaceChildren(saved, request);
        audit(
                actor,
                AuditAction.SERVICE_PACKAGE_CREATED,
                AuditTargetType.SERVICE_PACKAGE,
                saved.getId(),
                saved.getCode());
        return toResource(saved);
    }

    @Override
    @Transactional
    public AdminServicePackageResource updatePackage(
            Long id, SaveServicePackageRequest request, RequestActor actor) {
        ServicePackage servicePackage = requirePackage(id);
        if (packageRepository.existsByCodeAndIdNot(request.code(), id)
                || packageRepository.existsBySlugAndIdNot(request.slug(), id)) {
            throw new AppException(ErrorCode.DUPLICATE_PACKAGE_CODE);
        }
        validateBenefits(request.benefits());
        mapper.apply(servicePackage, request, requireCategory(request.categoryId()));
        syncBonusCreditsFromBenefits(servicePackage, request);
        adSlotRepository
                .findByServicePackageId(servicePackage.getId())
                .ifPresent(slot -> slot.setPricePerWeek(servicePackage.getPrice()));
        replaceChildren(servicePackage, request);
        audit(
                actor,
                AuditAction.SERVICE_PACKAGE_UPDATED,
                AuditTargetType.SERVICE_PACKAGE,
                id,
                servicePackage.getCode());
        return toResource(servicePackage);
    }

    @Override
    @Transactional
    public AdminServicePackageResource setStatus(
            Long id, ServicePackageStatus status, RequestActor actor) {
        ServicePackage servicePackage = requirePackage(id);
        servicePackage.setStatus(status);
        audit(
                actor,
                AuditAction.SERVICE_PACKAGE_STATUS_CHANGED,
                AuditTargetType.SERVICE_PACKAGE,
                id,
                status.name());
        return toResource(servicePackage);
    }

    @Override
    public UploadedPackageImageResource uploadPackageImage(MultipartFile file) {
        StoredFile stored =
                storageService.upload(file, StorageTarget.IMAGE, "service-packages/images");
        String url = storageService.publicImageUrl(stored.publicId());
        return new UploadedPackageImageResource(url, stored.publicId());
    }

    private void replaceChildren(ServicePackage servicePackage, SaveServicePackageRequest request) {
        benefitRepository.deleteByServicePackageId(servicePackage.getId());
        sectionRepository.deleteByServicePackageId(servicePackage.getId());
        benefitRepository.flush();
        sectionRepository.flush();

        List<ServicePackageBenefit> benefits = new ArrayList<>();
        List<SaveServicePackageRequest.Benefit> requestedBenefits =
                request.benefits() == null ? List.of() : request.benefits();
        for (int index = 0; index < requestedBenefits.size(); index++) {
            SaveServicePackageRequest.Benefit benefit = requestedBenefits.get(index);
            benefits.add(
                    ServicePackageBenefit.builder()
                            .servicePackage(servicePackage)
                            .entitlementType(benefit.entitlementType())
                            .quantity(benefit.quantity())
                            .tier(benefit.tier())
                            .durationDays(benefit.durationDays())
                            .label(benefit.label().trim())
                            .displayOrder(index)
                            .build());
        }
        benefitRepository.saveAll(benefits);

        List<ServicePackageSection> sections = new ArrayList<>();
        List<SaveServicePackageRequest.Section> requestedSections =
                request.sections() == null ? List.of() : request.sections();
        for (int index = 0; index < requestedSections.size(); index++) {
            SaveServicePackageRequest.Section section = requestedSections.get(index);
            sections.add(
                    ServicePackageSection.builder()
                            .servicePackage(servicePackage)
                            .heading(section.heading().trim())
                            .iconName(section.iconName())
                            .accentColor(section.accentColor())
                            .body(section.body())
                            .imageUrl(section.imageUrl())
                            .displayOrder(index)
                            .build());
        }
        sectionRepository.saveAll(sections);
    }

    private AdminServicePackageResource toResource(ServicePackage servicePackage) {
        return mapper.toAdminPackageResource(
                servicePackage,
                benefitRepository.findAllByServicePackageIdOrderByDisplayOrderAsc(
                        servicePackage.getId()),
                sectionRepository.findAllByServicePackageIdOrderByDisplayOrderAsc(
                        servicePackage.getId()));
    }

    private Specification<ServicePackage> toSpecification(
            AdminSearchServicePackagesRequest request) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (request.query() != null && !request.query().isBlank()) {
                String pattern = "%" + request.query().trim().toLowerCase() + "%";
                predicates.add(
                        builder.or(
                                builder.like(builder.lower(root.get("name")), pattern),
                                builder.like(builder.lower(root.get("code")), pattern)));
            }
            if (request.categoryId() != null) {
                predicates.add(builder.equal(root.get("category").get("id"), request.categoryId()));
            }
            if (request.status() != null) {
                predicates.add(builder.equal(root.get("status"), request.status()));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Map<Long, List<ServicePackageBenefit>> loadBenefits(List<ServicePackage> packages) {
        if (packages.isEmpty()) {
            return Map.of();
        }
        return benefitRepository
                .findAllByServicePackageIdInOrderByDisplayOrderAsc(
                        packages.stream().map(ServicePackage::getId).toList())
                .stream()
                .collect(Collectors.groupingBy(item -> item.getServicePackage().getId()));
    }

    private Map<Long, List<ServicePackageSection>> loadSections(List<ServicePackage> packages) {
        if (packages.isEmpty()) {
            return Map.of();
        }
        return sectionRepository
                .findAllByServicePackageIdInOrderByDisplayOrderAsc(
                        packages.stream().map(ServicePackage::getId).toList())
                .stream()
                .collect(Collectors.groupingBy(item -> item.getServicePackage().getId()));
    }

    private AdminServiceCategoryResource toCategoryResource(ServiceCategory category) {
        long total = packageRepository.countByCategoryId(category.getId());
        long active =
                total == 0
                        ? 0L
                        : packageRepository.countByCategoryIdAndStatus(
                                category.getId(), ServicePackageStatus.ACTIVE);
        return mapper.toAdminCategoryResource(category, total, active);
    }

    private void validateBenefits(List<SaveServicePackageRequest.Benefit> benefits) {
        if (benefits == null) {
            return;
        }
        for (int i = 0; i < benefits.size(); i++) {
            SaveServicePackageRequest.Benefit benefit = benefits.get(i);
            EntitlementConfigRules.validateBenefit(
                    i, benefit.entitlementType(), benefit.tier(), benefit.durationDays());
        }
    }

    private void syncBonusCreditsFromBenefits(
            ServicePackage servicePackage, SaveServicePackageRequest request) {
        if (request.benefits() == null) {
            return;
        }
        int creditSum =
                request.benefits().stream()
                        .filter(benefit -> benefit.entitlementType() == EntitlementType.CREDIT)
                        .mapToInt(SaveServicePackageRequest.Benefit::quantity)
                        .sum();
        if (creditSum > 0) {
            servicePackage.setBonusCredits(creditSum);
        }
    }

    private ServiceCategory requireCategory(Long id) {
        return categoryRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private ServicePackage requirePackage(Long id) {
        return packageRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE));
    }

    private void audit(
            RequestActor actor,
            AuditAction action,
            AuditTargetType targetType,
            Long targetId,
            String detail) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(targetType)
                        .targetId(targetId)
                        .detail(detail)
                        .ip(actor.ip())
                        .build());
    }
}
