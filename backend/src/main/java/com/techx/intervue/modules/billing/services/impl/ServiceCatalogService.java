package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.entities.ServicePackageBenefit;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import com.techx.intervue.modules.billing.mappers.ServicePackageMapper;
import com.techx.intervue.modules.billing.repositories.ServiceCategoryRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageBenefitRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import com.techx.intervue.modules.billing.repositories.ServicePackageSectionRepository;
import com.techx.intervue.modules.billing.resources.ServiceCatalogResource;
import com.techx.intervue.modules.billing.resources.ServiceCategoryResource;
import com.techx.intervue.modules.billing.resources.ServicePackageCardResource;
import com.techx.intervue.modules.billing.resources.ServicePackageDetailResource;
import com.techx.intervue.modules.billing.services.interfaces.ServiceCatalogServiceInterface;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ServiceCatalogService implements ServiceCatalogServiceInterface {

    private final ServiceCategoryRepository categoryRepository;
    private final ServicePackageRepository packageRepository;
    private final ServicePackageBenefitRepository benefitRepository;
    private final ServicePackageSectionRepository sectionRepository;
    private final ServicePackageMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public ServiceCatalogResource getCatalog() {
        List<ServicePackage> packages =
                packageRepository.findAllByStatusAndCategoryIsActiveTrueOrderByDisplayOrderAsc(
                        ServicePackageStatus.ACTIVE);
        Map<Long, List<ServicePackageBenefit>> benefitsByPackage = loadBenefits(packages);

        Map<Long, List<ServicePackageCardResource>> cardsByCategory =
                packages.stream()
                        .collect(
                                Collectors.groupingBy(
                                        item -> item.getCategory().getId(),
                                        Collectors.mapping(
                                                item ->
                                                        mapper.toCardResource(
                                                                item,
                                                                benefitsByPackage.getOrDefault(
                                                                        item.getId(), List.of())),
                                                Collectors.toList())));

        List<ServiceCategoryResource> categories =
                categoryRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc().stream()
                        .filter(category -> cardsByCategory.containsKey(category.getId()))
                        .map(
                                category ->
                                        mapper.toCategoryResource(
                                                category, cardsByCategory.get(category.getId())))
                        .toList();

        return new ServiceCatalogResource(categories);
    }

    @Override
    @Transactional(readOnly = true)
    public ServicePackageDetailResource getBySlug(String slug) {
        ServicePackage servicePackage =
                packageRepository
                        .findBySlugAndStatus(slug, ServicePackageStatus.ACTIVE)
                        .orElseThrow(() -> new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE));
        if (!servicePackage.isAvailableInCatalog()) {
            throw new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE);
        }
        return mapper.toDetailResource(
                servicePackage,
                benefitRepository.findAllByServicePackageIdOrderByDisplayOrderAsc(
                        servicePackage.getId()),
                sectionRepository.findAllByServicePackageIdOrderByDisplayOrderAsc(
                        servicePackage.getId()));
    }

    private Map<Long, List<ServicePackageBenefit>> loadBenefits(List<ServicePackage> packages) {
        if (packages.isEmpty()) {
            return Map.of();
        }
        List<Long> ids = packages.stream().map(ServicePackage::getId).toList();
        return benefitRepository.findAllByServicePackageIdInOrderByDisplayOrderAsc(ids).stream()
                .collect(Collectors.groupingBy(benefit -> benefit.getServicePackage().getId()));
    }
}
