package com.techx.intervue.modules.ai.requests;

import java.util.List;

public record CandidateRawData(
        String fullName,
        String title,
        List<String> topSkills,
        String experienceSummary,
        List<String> experiences,
        List<String> projects,
        List<String> educations,
        String cvText,
        Integer age,
        Integer birthYear,
        String dob,
        String gender,
        String avatarUrl,
        String photoUrl,
        String address,
        String origin,
        String hometown,
        String idCard,
        String cccd,
        String passport,
        List<String> screeningQuestions,
        List<String> screeningAnswers) {}
