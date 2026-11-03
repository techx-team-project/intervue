package com.techx.intervue.modules.company.mappers;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.entities.CompanyPhoto;
import com.techx.intervue.modules.company.enums.CompanyMemberRole;
import com.techx.intervue.modules.company.requests.SaveCompanyProfileRequest;
import com.techx.intervue.modules.company.resources.CompanyPhotoResource;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanyMapper {

    private final StorageServiceInterface storageService;

    public Company toNewEntity(SaveCompanyProfileRequest request) {
        Company company = new Company();
        applyUpdate(company, request);
        return company;
    }

    public void applyUpdate(Company company, SaveCompanyProfileRequest request) {
        company.setName(request.name());
        company.setTradingName(request.tradingName());
        company.setTaxCode(request.taxCode());
        company.setBusinessType(request.businessType());
        company.setIndustry(request.industry());
        company.setWebsite(request.website());
        company.setMarket(request.market());
        company.setTargetCustomers(request.targetCustomers());
        company.setSize(request.size());
        company.setEmail(request.email());
        company.setPhone(request.phone());
        company.setAddress(request.address());
        company.setDescription(request.description());
        company.setBenefits(request.benefits());
    }

    public CompanyResource toResource(
            Company company,
            CompanyMemberRole myRole,
            List<CompanyPhoto> photos,
            List<String> missingFields) {
        return CompanyResource.builder()
                .id(company.getId())
                .name(company.getName())
                .tradingName(company.getTradingName())
                .taxCode(company.getTaxCode())
                .businessType(company.getBusinessType())
                .industry(company.getIndustry())
                .website(company.getWebsite())
                .market(company.getMarket())
                .targetCustomers(company.getTargetCustomers())
                .size(company.getSize())
                .email(company.getEmail())
                .phone(company.getPhone())
                .address(company.getAddress())
                .description(company.getDescription())
                .benefits(company.getBenefits())
                .logoUrl(imageUrl(company.getLogoPublicId()))
                .photos(photos.stream().map(this::toPhotoResource).toList())
                .verificationStatus(company.getVerificationStatus())
                .verified(company.isVerified())
                .verifiedAt(company.getVerifiedAt())
                .myRole(myRole)
                .legalFieldsLocked(company.isVerified())
                .profileComplete(missingFields.isEmpty())
                .missingFields(missingFields)
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }

    public CompanySummaryResource toSummaryResource(Company company) {
        return CompanySummaryResource.builder()
                .id(company.getId())
                .name(company.getName())
                .tradingName(company.getTradingName())
                .taxCode(company.getTaxCode())
                .industry(company.getIndustry())
                .size(company.getSize())
                .address(company.getAddress())
                .logoUrl(imageUrl(company.getLogoPublicId()))
                .verified(company.isVerified())
                .build();
    }

    private CompanyPhotoResource toPhotoResource(CompanyPhoto photo) {
        return CompanyPhotoResource.builder()
                .id(photo.getId())
                .url(imageUrl(photo.getPublicId()))
                .sortOrder(photo.getSortOrder())
                .build();
    }

    private String imageUrl(String publicId) {
        return publicId == null ? null : storageService.publicImageUrl(publicId);
    }
}
