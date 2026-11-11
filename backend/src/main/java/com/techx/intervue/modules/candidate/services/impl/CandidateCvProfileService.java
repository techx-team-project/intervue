package com.techx.intervue.modules.candidate.services.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatMessage;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidateCertification;
import com.techx.intervue.modules.candidate.entities.CandidateEducation;
import com.techx.intervue.modules.candidate.entities.CandidateExperience;
import com.techx.intervue.modules.candidate.entities.CandidateExperienceSkill;
import com.techx.intervue.modules.candidate.entities.CandidateLanguage;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.entities.CandidateSkill;
import com.techx.intervue.modules.candidate.enums.CvUnreadableReason;
import com.techx.intervue.modules.candidate.enums.LanguageProficiency;
import com.techx.intervue.modules.candidate.enums.SkillCategory;
import com.techx.intervue.modules.candidate.enums.SkillLevel;
import com.techx.intervue.modules.candidate.mappers.CandidateCertificationMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateEducationMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateExperienceMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateLanguageMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateSkillMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateCertificationRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateEducationRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateExperienceRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateExperienceSkillRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateLanguageRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateSkillRepository;
import com.techx.intervue.modules.candidate.requests.ApplyCvParsedRequest;
import com.techx.intervue.modules.candidate.requests.SaveCandidateCertificationRequest;
import com.techx.intervue.modules.candidate.requests.SaveCandidateEducationRequest;
import com.techx.intervue.modules.candidate.requests.SaveCandidateExperienceRequest;
import com.techx.intervue.modules.candidate.requests.SaveCandidateLanguageRequest;
import com.techx.intervue.modules.candidate.requests.SaveCandidateSkillRequest;
import com.techx.intervue.modules.candidate.resources.CandidateCertificationResource;
import com.techx.intervue.modules.candidate.resources.CandidateEducationResource;
import com.techx.intervue.modules.candidate.resources.CandidateLanguageResource;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.resources.CandidateProfileSectionsResource;
import com.techx.intervue.modules.candidate.resources.CandidateSkillResource;
import com.techx.intervue.modules.candidate.resources.CvParseProfileResponse;
import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import com.techx.intervue.modules.candidate.resources.ParsedProfileData;
import com.techx.intervue.modules.candidate.resources.ProfileDiffItem;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateCvProfileServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandidateCvProfileService implements CandidateCvProfileServiceInterface {

    private static final String FEATURE_NAME = "cv-to-profile";
    private static final String PROMPT_NAME = "cv-to-profile";
    private static final int PROMPT_VERSION = 1;

    private final CvTextExtractorServiceInterface cvTextExtractorService;
    private final CvTextCleaner cvTextCleaner;
    private final CandidateResumeServiceInterface resumeService;
    private final AiGatewayServiceInterface aiGatewayService;
    private final PromptServiceInterface promptService;
    private final ObjectMapper objectMapper;

    private final CandidateProfileLookup profileLookup;
    private final CandidateProfileRepository profileRepository;
    private final CandidateProfileSectionsLoader sectionsLoader;
    private final CandidateProfileServiceInterface profileService;

    private final CandidateSkillRepository skillRepository;
    private final CandidateExperienceRepository experienceRepository;
    private final CandidateExperienceSkillRepository experienceSkillRepository;
    private final CandidateEducationRepository educationRepository;
    private final CandidateCertificationRepository certificationRepository;
    private final CandidateLanguageRepository languageRepository;

    private final CandidateSkillMapper skillMapper;
    private final CandidateExperienceMapper experienceMapper;
    private final CandidateEducationMapper educationMapper;
    private final CandidateCertificationMapper certificationMapper;
    private final CandidateLanguageMapper languageMapper;

    @Override
    @Transactional(readOnly = true)
    public CvParseProfileResponse parseCv(
            Long userId, MultipartFile file, Long resumeId, String ip) {
        CandidateProfile profile = profileLookup.findOrCreateForUpdate(userId);
        CandidateProfileSectionsResource sections = sectionsLoader.load(profile.getId());

        boolean isProfileEmpty = checkProfileEmpty(profile, sections);

        byte[] pdfBytes = resolvePdfBytes(file, resumeId, userId);
        CvTextExtractionResult extraction = cvTextExtractorService.extractText(pdfBytes);

        if (!extraction.readable() || extraction.unreadableReason() != null) {
            CvUnreadableReason reason =
                    extraction.unreadableReason() != null
                            ? extraction.unreadableReason()
                            : CvUnreadableReason.NO_TEXT_FOUND;
            return CvParseProfileResponse.builder()
                    .readable(false)
                    .unreadableReason(reason)
                    .reasonMessage(
                            extraction.reasonMessage() != null
                                    ? extraction.reasonMessage()
                                    : reason.getDefaultMessage())
                    .profileEmpty(isProfileEmpty)
                    .parsedData(null)
                    .diffs(List.of())
                    .build();
        }

        String cleanedText = cvTextCleaner.clean(extraction.text());
        PromptTemplate systemPrompt = promptService.load(PROMPT_NAME, PROMPT_VERSION);
        AiCallContext callContext = new AiCallContext(FEATURE_NAME, userId, ip, true);
        AiChatRequest chatRequest =
                new AiChatRequest(
                        systemPrompt,
                        List.of(AiChatMessage.user("Candidate CV Content:\n" + cleanedText)),
                        List.of());

        AiChatResult aiResult = aiGatewayService.chat(callContext, chatRequest);
        ParsedProfileData parsedData = parseAiOutput(aiResult.text());

        List<ProfileDiffItem> diffs = buildDiffs(profile, sections, parsedData);

        return CvParseProfileResponse.builder()
                .readable(true)
                .unreadableReason(null)
                .reasonMessage(null)
                .profileEmpty(isProfileEmpty)
                .parsedData(parsedData)
                .diffs(diffs)
                .build();
    }

    @Override
    @Transactional
    public CandidateProfileResource applyParsedData(Long userId, ApplyCvParsedRequest request) {
        CandidateProfile profile = profileLookup.findOrCreateForUpdate(userId);
        ParsedProfileData data = request.parsedData();
        if (data == null) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        if (request.applyHeadline() && data.headline() != null && !data.headline().isBlank()) {
            profile.setHeadline(data.headline().trim());
        }
        if (request.applyDesiredRole()
                && data.desiredRole() != null
                && !data.desiredRole().isBlank()) {
            profile.setDesiredRole(data.desiredRole().trim());
        }
        if (request.applyBio() && data.bio() != null && !data.bio().isBlank()) {
            profile.setBio(data.bio().trim());
        }
        if (request.applyTotalYoe() && data.totalYoe() != null) {
            profile.setTotalYoe(data.totalYoe());
        }
        profileRepository.save(profile);

        if (request.applySkills() && data.skills() != null) {
            Set<String> existingNames =
                    skillRepository.findByCandidateProfileIdOrderByNameAsc(profile.getId()).stream()
                            .map(s -> s.getName().trim().toLowerCase(Locale.ROOT))
                            .collect(Collectors.toSet());
            for (SaveCandidateSkillRequest skillReq : data.skills()) {
                if (skillReq.name() != null
                        && !skillReq.name().isBlank()
                        && !existingNames.contains(
                                skillReq.name().trim().toLowerCase(Locale.ROOT))) {
                    CandidateSkill skill =
                            CandidateSkill.builder().candidateProfile(profile).build();
                    skillMapper.apply(skill, skillReq);
                    skillRepository.save(skill);
                    existingNames.add(skillReq.name().trim().toLowerCase(Locale.ROOT));
                }
            }
        }

        if (request.applyExperiences() && data.experiences() != null) {
            for (SaveCandidateExperienceRequest expReq : data.experiences()) {
                if (expReq.title() != null
                        && !expReq.title().isBlank()
                        && expReq.companyName() != null
                        && expReq.startDate() != null) {
                    CandidateExperience exp =
                            CandidateExperience.builder().candidateProfile(profile).build();
                    experienceMapper.apply(exp, expReq);
                    experienceRepository.save(exp);
                    if (expReq.skills() != null) {
                        for (String sk : expReq.skills()) {
                            if (sk != null && !sk.isBlank()) {
                                experienceSkillRepository.save(
                                        CandidateExperienceSkill.builder()
                                                .candidateExperience(exp)
                                                .skill(sk.trim())
                                                .build());
                            }
                        }
                    }
                }
            }
        }

        if (request.applyEducations() && data.educations() != null) {
            for (SaveCandidateEducationRequest eduReq : data.educations()) {
                if (eduReq.school() != null
                        && !eduReq.school().isBlank()
                        && eduReq.startYear() != null) {
                    CandidateEducation edu =
                            CandidateEducation.builder().candidateProfile(profile).build();
                    educationMapper.apply(edu, eduReq);
                    educationRepository.save(edu);
                }
            }
        }

        if (request.applyCertifications() && data.certifications() != null) {
            for (SaveCandidateCertificationRequest certReq : data.certifications()) {
                if (certReq.name() != null
                        && !certReq.name().isBlank()
                        && certReq.issuer() != null
                        && !certReq.issuer().isBlank()) {
                    CandidateCertification cert =
                            CandidateCertification.builder().candidateProfile(profile).build();
                    certificationMapper.apply(cert, certReq);
                    certificationRepository.save(cert);
                }
            }
        }

        if (request.applyLanguages() && data.languages() != null) {
            Set<String> existingLangs =
                    languageRepository
                            .findByCandidateProfileIdOrderByLanguageAsc(profile.getId())
                            .stream()
                            .map(l -> l.getLanguage().trim().toLowerCase(Locale.ROOT))
                            .collect(Collectors.toSet());
            for (SaveCandidateLanguageRequest langReq : data.languages()) {
                if (langReq.language() != null
                        && !langReq.language().isBlank()
                        && !existingLangs.contains(
                                langReq.language().trim().toLowerCase(Locale.ROOT))) {
                    CandidateLanguage lang =
                            CandidateLanguage.builder().candidateProfile(profile).build();
                    languageMapper.apply(lang, langReq);
                    languageRepository.save(lang);
                    existingLangs.add(langReq.language().trim().toLowerCase(Locale.ROOT));
                }
            }
        }

        return profileService.getMine(userId);
    }

    private byte[] resolvePdfBytes(MultipartFile file, Long resumeId, Long userId) {
        if (file != null && !file.isEmpty()) {
            try {
                return file.getBytes();
            } catch (IOException e) {
                log.warn("Failed to read uploaded PDF: {}", e.getMessage());
                throw new AppException(ErrorCode.VALIDATION_FAILED);
            }
        }
        if (resumeId != null) {
            return resumeService.download(resumeId, userId).bytes();
        }
        throw new AppException(ErrorCode.VALIDATION_FAILED);
    }

    private boolean checkProfileEmpty(
            CandidateProfile profile, CandidateProfileSectionsResource sections) {
        boolean noHeadline = profile.getHeadline() == null || profile.getHeadline().isBlank();
        boolean noRole = profile.getDesiredRole() == null || profile.getDesiredRole().isBlank();
        boolean noBio = profile.getBio() == null || profile.getBio().isBlank();
        boolean noSkills = sections.skills() == null || sections.skills().isEmpty();
        boolean noExp = sections.experiences() == null || sections.experiences().isEmpty();

        return noHeadline && noRole && noBio && noSkills && noExp;
    }

    private List<ProfileDiffItem> buildDiffs(
            CandidateProfile profile,
            CandidateProfileSectionsResource sections,
            ParsedProfileData parsed) {
        List<ProfileDiffItem> diffs = new ArrayList<>();

        diffs.add(
                ProfileDiffItem.builder()
                        .field("headline")
                        .label("Tiêu đề hồ sơ (Headline)")
                        .oldValue(profile.getHeadline())
                        .newValue(parsed.headline())
                        .hasChange(
                                parsed.headline() != null
                                        && !parsed.headline()
                                                .equalsIgnoreCase(profile.getHeadline()))
                        .build());

        diffs.add(
                ProfileDiffItem.builder()
                        .field("desiredRole")
                        .label("Vị trí mong muốn (Desired Role)")
                        .oldValue(profile.getDesiredRole())
                        .newValue(parsed.desiredRole())
                        .hasChange(
                                parsed.desiredRole() != null
                                        && !parsed.desiredRole()
                                                .equalsIgnoreCase(profile.getDesiredRole()))
                        .build());

        diffs.add(
                ProfileDiffItem.builder()
                        .field("bio")
                        .label("Giới thiệu bản thân (Bio)")
                        .oldValue(profile.getBio())
                        .newValue(parsed.bio())
                        .hasChange(
                                parsed.bio() != null
                                        && !parsed.bio().equalsIgnoreCase(profile.getBio()))
                        .build());

        diffs.add(
                ProfileDiffItem.builder()
                        .field("totalYoe")
                        .label("Số năm kinh nghiệm")
                        .oldValue(profile.getTotalYoe())
                        .newValue(parsed.totalYoe())
                        .hasChange(
                                parsed.totalYoe() != null
                                        && !parsed.totalYoe().equals(profile.getTotalYoe()))
                        .build());

        List<String> oldSkills =
                sections.skills() != null
                        ? sections.skills().stream().map(CandidateSkillResource::name).toList()
                        : List.of();
        List<String> newSkills =
                parsed.skills() != null
                        ? parsed.skills().stream().map(SaveCandidateSkillRequest::name).toList()
                        : List.of();
        diffs.add(
                ProfileDiffItem.builder()
                        .field("skills")
                        .label("Kỹ năng chuyên môn")
                        .oldValue(oldSkills)
                        .newValue(newSkills)
                        .hasChange(!newSkills.isEmpty() && !oldSkills.containsAll(newSkills))
                        .build());

        List<String> oldExp =
                sections.experiences() != null
                        ? sections.experiences().stream()
                                .map(e -> e.title() + " tại " + e.companyName())
                                .toList()
                        : List.of();
        List<String> newExp =
                parsed.experiences() != null
                        ? parsed.experiences().stream()
                                .map(e -> e.title() + " tại " + e.companyName())
                                .toList()
                        : List.of();
        diffs.add(
                ProfileDiffItem.builder()
                        .field("experiences")
                        .label("Kinh nghiệm làm việc")
                        .oldValue(oldExp)
                        .newValue(newExp)
                        .hasChange(!newExp.isEmpty())
                        .build());

        List<String> oldEdu =
                sections.educations() != null
                        ? sections.educations().stream()
                                .map(CandidateEducationResource::school)
                                .toList()
                        : List.of();
        List<String> newEdu =
                parsed.educations() != null
                        ? parsed.educations().stream()
                                .map(SaveCandidateEducationRequest::school)
                                .toList()
                        : List.of();
        diffs.add(
                ProfileDiffItem.builder()
                        .field("educations")
                        .label("Học vấn")
                        .oldValue(oldEdu)
                        .newValue(newEdu)
                        .hasChange(!newEdu.isEmpty())
                        .build());

        List<String> oldCerts =
                sections.certifications() != null
                        ? sections.certifications().stream()
                                .map(CandidateCertificationResource::name)
                                .toList()
                        : List.of();
        List<String> newCerts =
                parsed.certifications() != null
                        ? parsed.certifications().stream()
                                .map(SaveCandidateCertificationRequest::name)
                                .toList()
                        : List.of();
        diffs.add(
                ProfileDiffItem.builder()
                        .field("certifications")
                        .label("Chứng chỉ")
                        .oldValue(oldCerts)
                        .newValue(newCerts)
                        .hasChange(!newCerts.isEmpty())
                        .build());

        List<String> oldLangs =
                sections.languages() != null
                        ? sections.languages().stream()
                                .map(CandidateLanguageResource::language)
                                .toList()
                        : List.of();
        List<String> newLangs =
                parsed.languages() != null
                        ? parsed.languages().stream()
                                .map(SaveCandidateLanguageRequest::language)
                                .toList()
                        : List.of();
        diffs.add(
                ProfileDiffItem.builder()
                        .field("languages")
                        .label("Ngoại ngữ")
                        .oldValue(oldLangs)
                        .newValue(newLangs)
                        .hasChange(!newLangs.isEmpty())
                        .build());

        return diffs;
    }

    private ParsedProfileData parseAiOutput(String rawResponse) {
        try {
            String jsonContent = extractJson(rawResponse);
            JsonNode root = objectMapper.readTree(jsonContent);

            String headline = root.path("headline").asText(null);
            String desiredRole = root.path("desiredRole").asText(null);
            String bio = root.path("bio").asText(null);
            BigDecimal totalYoe =
                    root.has("totalYoe")
                            ? BigDecimal.valueOf(root.path("totalYoe").asDouble())
                            : null;

            List<SaveCandidateSkillRequest> skills = new ArrayList<>();
            JsonNode skillsNode = root.path("skills");
            if (skillsNode.isArray()) {
                for (JsonNode sn : skillsNode) {
                    String name = sn.path("name").asText("").trim();
                    if (!name.isBlank()) {
                        SkillCategory cat = parseCategory(sn.path("category").asText("CORE"));
                        SkillLevel lvl = parseLevel(sn.path("level").asText("INTERMEDIATE"));
                        int years = Math.max(sn.path("years").asInt(1), 0);
                        skills.add(new SaveCandidateSkillRequest(name, cat, lvl, years));
                    }
                }
            }

            List<SaveCandidateExperienceRequest> experiences = new ArrayList<>();
            JsonNode expNode = root.path("experiences");
            if (expNode.isArray()) {
                for (JsonNode en : expNode) {
                    String title = en.path("title").asText("").trim();
                    String company = en.path("companyName").asText("").trim();
                    String location = en.path("location").asText(null);
                    LocalDate startDate =
                            parseDate(en.path("startDate").asText(null), LocalDate.of(2023, 1, 1));
                    boolean current = en.path("current").asBoolean(false);
                    LocalDate endDate =
                            current ? null : parseDate(en.path("endDate").asText(null), null);
                    String desc = en.path("description").asText(null);
                    String ach = en.path("achievements").asText(null);

                    List<String> expSkills = new ArrayList<>();
                    JsonNode sArr = en.path("skills");
                    if (sArr.isArray()) {
                        for (JsonNode sk : sArr) {
                            if (!sk.asText("").isBlank()) expSkills.add(sk.asText().trim());
                        }
                    }

                    if (!title.isBlank() && !company.isBlank()) {
                        experiences.add(
                                new SaveCandidateExperienceRequest(
                                        title, company, location, startDate, endDate, current, desc,
                                        ach, expSkills));
                    }
                }
            }

            List<SaveCandidateEducationRequest> educations = new ArrayList<>();
            JsonNode eduNode = root.path("educations");
            if (eduNode.isArray()) {
                for (JsonNode edn : eduNode) {
                    String school = edn.path("school").asText("").trim();
                    String degree = edn.path("degree").asText(null);
                    String major = edn.path("major").asText(null);
                    int startYear = edn.path("startYear").asInt(2018);
                    Integer endYear = edn.has("endYear") ? edn.path("endYear").asInt() : null;
                    String gpa = edn.path("gpa").asText(null);
                    if (!school.isBlank()) {
                        educations.add(
                                new SaveCandidateEducationRequest(
                                        school, degree, major, startYear, endYear, gpa, null));
                    }
                }
            }

            List<SaveCandidateCertificationRequest> certifications = new ArrayList<>();
            JsonNode certNode = root.path("certifications");
            if (certNode.isArray()) {
                for (JsonNode cn : certNode) {
                    String name = cn.path("name").asText("").trim();
                    String issuer =
                            cn.path("organization").asText(cn.path("issuer").asText("")).trim();
                    LocalDate issueDate = parseDate(cn.path("issueDate").asText(null), null);
                    String credUrl = cn.path("credentialUrl").asText(null);
                    if (!name.isBlank() && !issuer.isBlank()) {
                        certifications.add(
                                new SaveCandidateCertificationRequest(
                                        name, issuer, issueDate, null, credUrl));
                    }
                }
            }

            List<SaveCandidateLanguageRequest> languages = new ArrayList<>();
            JsonNode langNode = root.path("languages");
            if (langNode.isArray()) {
                for (JsonNode ln : langNode) {
                    String lang = ln.path("language").asText("").trim();
                    LanguageProficiency prof =
                            parseLanguageProficiency(ln.path("proficiency").asText("INTERMEDIATE"));
                    if (!lang.isBlank()) {
                        languages.add(new SaveCandidateLanguageRequest(lang, prof, null));
                    }
                }
            }

            return ParsedProfileData.builder()
                    .headline(headline)
                    .desiredRole(desiredRole)
                    .bio(bio)
                    .totalYoe(totalYoe)
                    .skills(skills)
                    .experiences(experiences)
                    .educations(educations)
                    .certifications(certifications)
                    .languages(languages)
                    .build();
        } catch (Exception e) {
            log.warn("Failed to parse AI output into profile data: {}", e.getMessage());
            return ParsedProfileData.builder()
                    .headline("Software Engineer")
                    .bio("Experienced professional.")
                    .skills(List.of())
                    .experiences(List.of())
                    .educations(List.of())
                    .certifications(List.of())
                    .languages(List.of())
                    .build();
        }
    }

    private SkillCategory parseCategory(String val) {
        try {
            return SkillCategory.valueOf(val.toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            return SkillCategory.CORE;
        }
    }

    private SkillLevel parseLevel(String val) {
        try {
            return SkillLevel.valueOf(val.toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            return SkillLevel.INTERMEDIATE;
        }
    }

    private LanguageProficiency parseLanguageProficiency(String val) {
        try {
            return LanguageProficiency.valueOf(val.toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            return LanguageProficiency.INTERMEDIATE;
        }
    }

    private LocalDate parseDate(String val, LocalDate fallback) {
        if (val == null || val.isBlank()) return fallback;
        try {
            String trimmed = val.trim();
            if (trimmed.length() == 7) { // YYYY-MM
                trimmed = trimmed + "-01";
            }
            return LocalDate.parse(trimmed);
        } catch (DateTimeParseException e) {
            return fallback;
        }
    }

    private String extractJson(String text) {
        if (text == null) return "{}";
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return text.substring(start, end + 1);
        }
        return text;
    }
}
