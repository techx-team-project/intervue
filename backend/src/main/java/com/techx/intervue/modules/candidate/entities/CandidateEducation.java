package com.techx.intervue.modules.candidate.entities;

import com.techx.intervue.common.entities.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name = "candidate_educations")
public class CandidateEducation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_profile_id", nullable = false)
    private CandidateProfile candidateProfile;

    @Column(name = "school", nullable = false, length = 150)
    private String school;

    @Column(name = "degree", length = 100)
    private String degree;

    @Column(name = "major", length = 150)
    private String major;

    @Column(name = "start_year", nullable = false)
    private Short startYear;

    @Column(name = "end_year")
    private Short endYear;

    @Column(name = "gpa", length = 20)
    private String gpa;

    @Column(name = "achievements", columnDefinition = "TEXT")
    private String achievements;
}
