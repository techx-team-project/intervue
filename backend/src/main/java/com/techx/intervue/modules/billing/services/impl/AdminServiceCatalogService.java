package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.ServiceCategory;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.entities.ServicePackageBenefit;
import com.techx.intervue.modules.billing.entities.ServicePackageSection;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import com.techx.intervue.modules.billing.mappers.ServicePackageMapper;
import com.techx.intervue.modules.billing.repositories.ServiceCategoryRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageBenefitRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageSectionRepository;
import com.techx.intervue.modules.billing.requests.AdminSearchServicePackagesRequest;
import com.techx.intervue.modules.billing.requests.SaveServiceCategoryRequest;
import com.techx.intervue.modules.billing.requests.SaveServicePackageRequest;
import com.techx.intervue.modules.billing.resources.AdminServiceCategoryResource;
import com.techx.intervue.modules.billing.resources.AdminServicePackageResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminServiceCatalogServiceInterface;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminServiceCatalogService implements AdminServiceCatalogServiceInterface {

    private final ServiceCategoryRepository categoryRepository;
    private final ServicePackageRepository packageRepository;
    private final ServicePackageBenefitRepository benefitRepository;
    private final ServicePackageSectionRepository sectionRepository;
    private final ServicePackageMapper mapper;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional(readOnly = true)
    public List<AdminServiceCategoryResource> listCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(
                        category ->
                                mapper.toAdminCategoryResource(
                                        category,
                                        packageRepository.countByCategoryId(category.getId())))
                .toList();
    }

    @Override
    @Transactional
    public AdminServiceCategoryResource createCategory(
            SaveServiceCategoryRequest request, RequestActor actor) {
        if (categoryRepository.existsByCode(request.code())) {
            throw new AppException(ErrorCode.DUPLICATE_PACKAGE_CODE);
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
        return mapper.toAdminCategoryResource(saved, 0L);
    }

    @Override
    @Transactional
    public AdminServiceCategoryResource updateCategory(
            Long id, SaveServiceCategoryRequest request, RequestActor actor) {
        ServiceCategory category = requireCategory(id);
        if (categoryRepository.existsByCodeAndIdNot(request.code(), id)) {
            throw new AppException(ErrorCode.DUPLICATE_PACKAGE_CODE);
        }
        mapper.apply(category, request);
        audit(
                actor,
                AuditAction.SERVICE_CATEGORY_UPDATED,
                AuditTargetType.SERVICE_CATEGORY,
                id,
                category.getCode());
        return mapper.toAdminCategoryResource(category, packageRepository.countByCategoryId(id));
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
        ServicePackage servicePackage = new ServicePackage();
        mapper.apply(servicePackage, request, requireCategory(request.categoryId()));
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
        mapper.apply(servicePackage, request, requireCategory(request.categoryId()));
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
