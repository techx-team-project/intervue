package com.techx.intervue.modules.candidate.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.candidate.enums.CareerLevel;
import com.techx.intervue.modules.candidate.enums.ContractType;
import com.techx.intervue.modules.candidate.enums.Gender;
import com.techx.intervue.modules.candidate.enums.JobSearchStatus;
import com.techx.intervue.modules.candidate.enums.WorkMode;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "candidate_profiles")
public class CandidateProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(length = 120)
    private String headline;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "contact_email")
    private String contactEmail;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Column(name = "birth_year")
    private Short birthYear;

    @Column(name = "show_personal_details", nullable = false)
    @Builder.Default
    private boolean showPersonalDetails = false;

    @Column(name = "searchable_by_recruiters", nullable = false)
    @Builder.Default
    private boolean searchableByRecruiters = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_search_status", nullable = false, length = 20)
    @Builder.Default
    private JobSearchStatus jobSearchStatus = JobSearchStatus.OPEN_TO_OFFERS;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "avatar_public_id")
    private String avatarPublicId;

    @Column(name = "cover_public_id")
    private String coverPublicId;

    @Column(name = "desired_role", length = 120)
    private String desiredRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "desired_level", length = 20)
    private CareerLevel desiredLevel;

    @Column(name = "salary_min")
    private Long salaryMin;

    @Column(name = "salary_max")
    private Long salaryMax;

    @Column(name = "salary_negotiable", nullable = false)
    @Builder.Default
    private boolean salaryNegotiable = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode", length = 20)
    private WorkMode workMode;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", length = 20)
    private ContractType contractType;

    @ElementCollection
    @OrderBy
    @CollectionTable(
            name = "candidate_preferred_locations",
            joinColumns = @JoinColumn(name = "candidate_profile_id"))
    @Column(name = "city", nullable = false, length = 100)
    @Builder.Default
    private Set<String> preferredLocations = new LinkedHashSet<>();

    @ElementCollection
    @OrderBy
    @CollectionTable(
            name = "candidate_preferred_industries",
            joinColumns = @JoinColumn(name = "candidate_profile_id"))
    @Column(name = "industry", nullable = false, length = 100)
    @Builder.Default
    private Set<String> preferredIndustries = new LinkedHashSet<>();
}
