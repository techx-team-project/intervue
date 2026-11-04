package com.techx.intervue.modules.candidate.mappers;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidatePreferredIndustry;
import com.techx.intervue.modules.candidate.entities.CandidatePreferredLocation;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.requests.SaveCandidateProfileRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.resources.CandidateProfileSectionsResource;
import com.techx.intervue.modules.user.resources.UserResource;
import java.util.Collection;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CandidateProfileMapper {

    private final StorageServiceInterface storageService;

    public void applyUpdate(CandidateProfile profile, SaveCandidateProfileRequest request) {
        boolean negotiable = request.salaryNegotiable();
        profile.setHeadline(blankToNull(request.headline()));
        profile.setBio(blankToNull(request.bio()));
        profile.setContactEmail(blankToNull(request.contactEmail()));
        profile.setGender(request.gender());
        profile.setBirthYear(request.birthYear() == null ? null : request.birthYear().shortValue());
        profile.setShowPersonalDetails(request.showPersonalDetails());
        profile.setSearchableByRecruiters(request.searchableByRecruiters());
        profile.setJobSearchStatus(request.jobSearchStatus());
        profile.setGithubUrl(blankToNull(request.githubUrl()));
        profile.setLinkedinUrl(blankToNull(request.linkedinUrl()));
        profile.setPortfolioUrl(blankToNull(request.portfolioUrl()));
        profile.setDesiredRole(request.desiredRole().trim());
        profile.setDesiredLevel(request.desiredLevel());
        profile.setSalaryNegotiable(negotiable);
        profile.setSalaryMin(negotiable ? null : request.salaryMin());
        profile.setSalaryMax(negotiable ? null : request.salaryMax());
        profile.setWorkMode(request.workMode());
        profile.setContractType(request.contractType());
    }

    public CandidateProfileResource toResource(
            CandidateProfile profile,
            UserResource user,
            List<CandidatePreferredLocation> preferredLocations,
            List<CandidatePreferredIndustry> preferredIndustries,
            CandidateProfileSectionsResource sections) {
        return CandidateProfileResource.builder()
                .userId(user.id())
                .name(user.name())
                .email(user.email())
                .contactEmail(profile.getContactEmail())
                .phone(user.phone())
                .phoneVerified(user.phoneVerified())
                .address(user.address())
                .avatarUrl(imageUrl(profile.getAvatarPublicId()))
                .coverUrl(imageUrl(profile.getCoverPublicId()))
                .headline(profile.getHeadline())
                .bio(profile.getBio())
                .gender(profile.getGender())
                .birthYear(
                        profile.getBirthYear() == null ? null : profile.getBirthYear().intValue())
                .showPersonalDetails(profile.isShowPersonalDetails())
                .searchableByRecruiters(profile.isSearchableByRecruiters())
                .jobSearchStatus(profile.getJobSearchStatus())
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .desiredRole(profile.getDesiredRole())
                .desiredLevel(profile.getDesiredLevel())
                .salaryNegotiable(profile.isSalaryNegotiable())
                .salaryMin(profile.getSalaryMin())
                .salaryMax(profile.getSalaryMax())
                .workMode(profile.getWorkMode())
                .contractType(profile.getContractType())
                .preferredLocations(sorted(preferredLocations.stream().map(this::toCity).toList()))
                .preferredIndustries(
                        sorted(preferredIndustries.stream().map(this::toIndustry).toList()))
                .experiences(sections.experiences())
                .educations(sections.educations())
                .projects(sections.projects())
                .certifications(sections.certifications())
                .languages(sections.languages())
                .skills(sections.skills())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    private String toCity(CandidatePreferredLocation location) {
        return location.getCity();
    }

    private String toIndustry(CandidatePreferredIndustry industry) {
        return industry.getIndustry();
    }

    private List<String> sorted(Collection<String> values) {
        return values.stream().sorted(String.CASE_INSENSITIVE_ORDER).toList();
    }

    private String imageUrl(String publicId) {
        return publicId == null ? null : storageService.publicImageUrl(publicId);
    }

    private String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
