package com.techx.intervue.modules.company.mappers;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.entities.CompanyPhoto;
import com.techx.intervue.modules.company.entities.CompanyProfile;
import com.techx.intervue.modules.company.requests.SaveCompanyProfileRequest;
import com.techx.intervue.modules.company.resources.CompanyPhotoResource;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import com.techx.intervue.modules.company.resources.PublicCompanyResource;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanyMapper {

    private final StorageServiceInterface storageService;

    public void applyProfile(CompanyProfile profile, SaveCompanyProfileRequest request) {
        profile.setTradingName(request.tradingName());
        profile.setBusinessType(request.businessType());
        profile.setIndustry(request.industry());
        profile.setWebsite(request.website());
        profile.setMarket(request.market());
        profile.setTargetCustomers(request.targetCustomers());
        profile.setSize(request.size());
        profile.setEmail(request.email());
        profile.setPhone(request.phone());
        profile.setAddress(request.address());
        profile.setDescription(request.description());
        profile.setBenefits(request.benefits());
    }

    public CompanyResource toResource(
            Company company,
            CompanyProfile profile,
            List<CompanyPhoto> photos,
            List<String> missingFields) {
        return CompanyResource.builder()
                .id(company.getId())
                .name(company.getName())
                .taxCode(company.getTaxCode())
                .registeredAddress(company.getAddress())
                .tradingName(profile.getTradingName())
                .businessType(profile.getBusinessType())
                .industry(profile.getIndustry())
                .website(profile.getWebsite())
                .market(profile.getMarket())
                .targetCustomers(profile.getTargetCustomers())
                .size(profile.getSize())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .description(profile.getDescription())
                .benefits(profile.getBenefits())
                .logoUrl(imageUrl(profile.getLogoPublicId()))
                .photos(photos.stream().map(this::toPhotoResource).toList())
                .profileComplete(missingFields.isEmpty())
                .missingFields(missingFields)
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    public PublicCompanyResource toPublicResource(
            Company company, CompanyProfile profile, List<CompanyPhoto> photos) {
        PublicCompanyResource.PublicCompanyResourceBuilder builder =
                PublicCompanyResource.builder()
                        .id(company.getId())
                        .name(company.getName())
                        .address(company.getAddress())
                        .photoUrls(
                                photos.stream()
                                        .map(photo -> imageUrl(photo.getPublicId()))
                                        .toList());
        if (profile != null) {
            builder.tradingName(profile.getTradingName())
                    .industry(profile.getIndustry())
                    .size(profile.getSize())
                    .website(profile.getWebsite())
                    .email(profile.getEmail())
                    .phone(profile.getPhone())
                    .description(profile.getDescription())
                    .benefits(profile.getBenefits())
                    .logoUrl(imageUrl(profile.getLogoPublicId()));
            if (profile.getAddress() != null && !profile.getAddress().isBlank()) {
                builder.address(profile.getAddress());
            }
        }
        return builder.build();
    }

    public CompanySummaryResource toSummaryResource(Company company) {
        return CompanySummaryResource.builder()
                .id(company.getId())
                .name(company.getName())
                .taxCode(company.getTaxCode())
                .address(company.getAddress())
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
