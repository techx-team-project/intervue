package com.techx.intervue.modules.candidate.mappers;

import com.techx.intervue.common.text.Texts;
import com.techx.intervue.modules.candidate.entities.CandidateLanguage;
import com.techx.intervue.modules.candidate.requests.SaveCandidateLanguageRequest;
import com.techx.intervue.modules.candidate.resources.CandidateLanguageResource;
import org.springframework.stereotype.Component;

@Component
public class CandidateLanguageMapper {

    public void apply(CandidateLanguage language, SaveCandidateLanguageRequest request) {
        language.setLanguage(request.language().trim());
        language.setProficiency(request.proficiency());
        language.setCertificate(Texts.blankToNull(request.certificate()));
    }

    public CandidateLanguageResource toResource(CandidateLanguage language) {
        return CandidateLanguageResource.builder()
                .id(language.getId())
                .language(language.getLanguage())
                .proficiency(language.getProficiency())
                .certificate(language.getCertificate())
                .build();
    }
}
