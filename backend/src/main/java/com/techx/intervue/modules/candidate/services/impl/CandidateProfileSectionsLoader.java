package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.modules.candidate.entities.CandidateExperience;
import com.techx.intervue.modules.candidate.entities.CandidateExperienceSkill;
import com.techx.intervue.modules.candidate.entities.CandidateProject;
import com.techx.intervue.modules.candidate.entities.CandidateProjectTechnology;
import com.techx.intervue.modules.candidate.mappers.CandidateCertificationMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateEducationMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateExperienceMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateLanguageMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateProjectMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateSkillMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateCertificationRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateEducationRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateExperienceRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateExperienceSkillRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateLanguageRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateProjectRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateProjectTechnologyRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateSkillRepository;
import com.techx.intervue.modules.candidate.resources.CandidateExperienceResource;
import com.techx.intervue.modules.candidate.resources.CandidateProfileSectionsResource;
import com.techx.intervue.modules.candidate.resources.CandidateProjectResource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CandidateProfileSectionsLoader {

    private final CandidateExperienceRepository experienceRepository;
    private final CandidateExperienceSkillRepository experienceSkillRepository;
    private final CandidateEducationRepository educationRepository;
    private final CandidateProjectRepository projectRepository;
    private final CandidateProjectTechnologyRepository projectTechnologyRepository;
    private final CandidateCertificationRepository certificationRepository;
    private final CandidateLanguageRepository languageRepository;
    private final CandidateSkillRepository skillRepository;
    private final CandidateExperienceMapper experienceMapper;
    private final CandidateEducationMapper educationMapper;
    private final CandidateProjectMapper projectMapper;
    private final CandidateCertificationMapper certificationMapper;
    private final CandidateLanguageMapper languageMapper;
    private final CandidateSkillMapper skillMapper;

    public CandidateProfileSectionsResource load(Long profileId) {
        return new CandidateProfileSectionsResource(
                loadExperiences(profileId),
                educationRepository.findByCandidateProfileIdOrderByStartYearDesc(profileId).stream()
                        .map(educationMapper::toResource)
                        .toList(),
                loadProjects(profileId),
                certificationRepository
                        .findByCandidateProfileIdOrderByIssueDateDesc(profileId)
                        .stream()
                        .map(certificationMapper::toResource)
                        .toList(),
                languageRepository.findByCandidateProfileIdOrderByLanguageAsc(profileId).stream()
                        .map(languageMapper::toResource)
                        .toList(),
                skillRepository.findByCandidateProfileIdOrderByNameAsc(profileId).stream()
                        .map(skillMapper::toResource)
                        .toList());
    }

    private List<CandidateExperienceResource> loadExperiences(Long profileId) {
        List<CandidateExperience> experiences =
                experienceRepository.findByCandidateProfileIdOrderByCurrentDescStartDateDesc(
                        profileId);
        List<Long> ids = new ArrayList<>();
        for (CandidateExperience experience : experiences) {
            ids.add(experience.getId());
        }
        Map<Long, List<String>> skillsByExperience = new HashMap<>();
        if (!ids.isEmpty()) {
            for (CandidateExperienceSkill row :
                    experienceSkillRepository.findByCandidateExperienceIdIn(ids)) {
                skillsByExperience
                        .computeIfAbsent(
                                row.getCandidateExperience().getId(), id -> new ArrayList<>())
                        .add(row.getSkill());
            }
        }
        return experiences.stream()
                .map(
                        experience ->
                                experienceMapper.toResource(
                                        experience,
                                        skillsByExperience.getOrDefault(
                                                experience.getId(), List.of())))
                .toList();
    }

    private List<CandidateProjectResource> loadProjects(Long profileId) {
        List<CandidateProject> projects =
                projectRepository.findByCandidateProfileIdOrderByCurrentDescStartDateDesc(
                        profileId);
        List<Long> ids = new ArrayList<>();
        for (CandidateProject project : projects) {
            ids.add(project.getId());
        }
        Map<Long, List<String>> technologiesByProject = new HashMap<>();
        if (!ids.isEmpty()) {
            for (CandidateProjectTechnology row :
                    projectTechnologyRepository.findByCandidateProjectIdIn(ids)) {
                technologiesByProject
                        .computeIfAbsent(row.getCandidateProject().getId(), id -> new ArrayList<>())
                        .add(row.getTechnology());
            }
        }
        return projects.stream()
                .map(
                        project ->
                                projectMapper.toResource(
                                        project,
                                        technologiesByProject.getOrDefault(
                                                project.getId(), List.of())))
                .toList();
    }
}
