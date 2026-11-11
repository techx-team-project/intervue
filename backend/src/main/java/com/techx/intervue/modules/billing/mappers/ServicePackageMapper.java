package com.techx.intervue.modules.billing.mappers;

import com.techx.intervue.modules.billing.entities.ServiceCategory;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.entities.ServicePackageBenefit;
import com.techx.intervue.modules.billing.entities.ServicePackageSection;
import com.techx.intervue.modules.billing.requests.SaveServiceCategoryRequest;
import com.techx.intervue.modules.billing.requests.SaveServicePackageRequest;
import com.techx.intervue.modules.billing.resources.AdminServiceCategoryResource;
import com.techx.intervue.modules.billing.resources.AdminServicePackageResource;
import com.techx.intervue.modules.billing.resources.ServiceCategoryResource;
import com.techx.intervue.modules.billing.resources.ServicePackageBenefitResource;
import com.techx.intervue.modules.billing.resources.ServicePackageCardResource;
import com.techx.intervue.modules.billing.resources.ServicePackageDetailResource;
import com.techx.intervue.modules.billing.resources.ServicePackageSectionResource;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ServicePackageMapper {

    private static final String DEFAULT_CURRENCY = "VND";

    public void apply(ServiceCategory category, SaveServiceCategoryRequest request) {
        category.setCode(request.code().trim());
        category.setName(request.name().trim());
        category.setHeadline(request.headline().trim());
        category.setDescription(request.description());
        category.setNeedKey(request.needKey());
        category.setDisplayOrder(request.displayOrder());
        category.setIsActive(request.isActive());
    }

    public void apply(
            ServicePackage servicePackage,
            SaveServicePackageRequest request,
            ServiceCategory category) {
        servicePackage.setCategory(category);
        servicePackage.setCode(request.code().trim());
        servicePackage.setSlug(request.slug().trim());
        servicePackage.setName(request.name().trim());
        servicePackage.setShortDescription(request.shortDescription());
        servicePackage.setPrice(request.price());
        servicePackage.setCurrency(
                request.currency() == null || request.currency().isBlank()
                        ? DEFAULT_CURRENCY
                        : request.currency().trim().toUpperCase());
        servicePackage.setBadge(request.badge());
        servicePackage.setVipRibbon(request.vipRibbon());
        servicePackage.setAccentColor(request.accentColor());
        servicePackage.setHeroImageUrl(request.heroImageUrl());
        servicePackage.setValidityDays(request.validityDays());
        servicePackage.setBonusCredits(request.bonusCredits());
        servicePackage.setOneTimePerCompany(request.oneTimePerCompany());
        servicePackage.setStatus(request.status());
        servicePackage.setDisplayOrder(request.displayOrder());
    }

    public ServicePackageBenefitResource toBenefitResource(ServicePackageBenefit benefit) {
        return new ServicePackageBenefitResource(
                benefit.getEntitlementType(),
                benefit.getQuantity(),
                benefit.getTier(),
                benefit.getDurationDays(),
                benefit.getLabel());
    }

    public ServicePackageSectionResource toSectionResource(ServicePackageSection section) {
        return new ServicePackageSectionResource(
                section.getHeading(),
                section.getIconName(),
                section.getAccentColor(),
                section.getBody(),
                section.getImageUrl());
    }

    public ServicePackageCardResource toCardResource(
            ServicePackage servicePackage, List<ServicePackageBenefit> benefits) {
        return new ServicePackageCardResource(
                servicePackage.getId(),
                servicePackage.getCode(),
                servicePackage.getSlug(),
                servicePackage.getName(),
                servicePackage.getShortDescription(),
                servicePackage.getPrice(),
                servicePackage.getCurrency(),
                servicePackage.getBadge(),
                servicePackage.getVipRibbon(),
                servicePackage.getAccentColor(),
                servicePackage.getValidityDays(),
                servicePackage.getBonusCredits(),
                servicePackage.getOneTimePerCompany(),
                benefits.stream().map(this::toBenefitResource).toList());
    }

    public ServiceCategoryResource toCategoryResource(
            ServiceCategory category, List<ServicePackageCardResource> packages) {
        return new ServiceCategoryResource(
                category.getId(),
                category.getCode(),
                category.getName(),
                category.getHeadline(),
                category.getDescription(),
                category.getNeedKey(),
                packages);
    }

    public ServicePackageDetailResource toDetailResource(
            ServicePackage servicePackage,
            List<ServicePackageBenefit> benefits,
            List<ServicePackageSection> sections) {
        ServiceCategory category = servicePackage.getCategory();
        return new ServicePackageDetailResource(
                servicePackage.getId(),
                servicePackage.getCode(),
                servicePackage.getSlug(),
                servicePackage.getName(),
                servicePackage.getShortDescription(),
                servicePackage.getPrice(),
                servicePackage.getCurrency(),
                servicePackage.getBadge(),
                servicePackage.getVipRibbon(),
                servicePackage.getAccentColor(),
                servicePackage.getHeroImageUrl(),
                servicePackage.getValidityDays(),
                servicePackage.getBonusCredits(),
                servicePackage.getOneTimePerCompany(),
                category.getCode(),
                category.getName(),
                category.getHeadline(),
                benefits.stream().map(this::toBenefitResource).toList(),
                sections.stream().map(this::toSectionResource).toList());
    }

    public AdminServiceCategoryResource toAdminCategoryResource(
            ServiceCategory category, long packageCount) {
        return new AdminServiceCategoryResource(
                category.getId(),
                category.getCode(),
                category.getName(),
                category.getHeadline(),
                category.getDescription(),
                category.getNeedKey(),
                category.getDisplayOrder(),
                category.getIsActive(),
                packageCount);
    }

    public AdminServicePackageResource toAdminPackageResource(
            ServicePackage servicePackage,
            List<ServicePackageBenefit> benefits,
            List<ServicePackageSection> sections) {
        ServiceCategory category = servicePackage.getCategory();
        return new AdminServicePackageResource(
                servicePackage.getId(),
                category.getId(),
                category.getCode(),
                servicePackage.getCode(),
                servicePackage.getSlug(),
                servicePackage.getName(),
                servicePackage.getShortDescription(),
                servicePackage.getPrice(),
                servicePackage.getCurrency(),
                servicePackage.getBadge(),
                servicePackage.getVipRibbon(),
                servicePackage.getAccentColor(),
                servicePackage.getHeroImageUrl(),
                servicePackage.getValidityDays(),
                servicePackage.getBonusCredits(),
                servicePackage.getOneTimePerCompany(),
                servicePackage.getStatus(),
                servicePackage.getDisplayOrder(),
                benefits.stream().map(this::toBenefitResource).toList(),
                sections.stream().map(this::toSectionResource).toList());
    }
}
