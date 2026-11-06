package com.techx.intervue.modules.ai.resources;

public record RequirementEvidenceMatch(
        String requirement, boolean hasEvidence, String evidence, String clarificationNote) {

    public static final String MISSING_EVIDENCE_TEXT = "no evidence yet";
    public static final String MISSING_SKILL_DISCLAIMER =
            "Missing information does not mean a missing skill — ask before you conclude.";

    public static RequirementEvidenceMatch withEvidence(String requirement, String evidence) {
        return new RequirementEvidenceMatch(requirement, true, evidence, null);
    }

    public static RequirementEvidenceMatch withoutEvidence(String requirement) {
        return new RequirementEvidenceMatch(
                requirement, false, MISSING_EVIDENCE_TEXT, MISSING_SKILL_DISCLAIMER);
    }
}
