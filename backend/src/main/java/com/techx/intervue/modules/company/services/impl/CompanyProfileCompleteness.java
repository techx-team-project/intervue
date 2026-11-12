package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.modules.company.entities.CompanyProfile;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CompanyProfileCompleteness {

    static final int MIN_DESCRIPTION_LENGTH = 200;

    public List<String> missingFields(CompanyProfile profile) {
        List<String> missing = new ArrayList<>();
        requireText(missing, "industry", profile.getIndustry());
        requireText(missing, "size", profile.getSize());
        requireText(missing, "address", profile.getAddress());
        requireText(missing, "email", profile.getEmail());
        if (profile.getBusinessType() == null) {
            missing.add("businessType");
        }
        if (profile.getDescription() == null
                || profile.getDescription().trim().length() < MIN_DESCRIPTION_LENGTH) {
            missing.add("description");
        }
        return List.copyOf(missing);
    }

    public boolean isComplete(CompanyProfile profile) {
        return missingFields(profile).isEmpty();
    }

    private void requireText(List<String> missing, String field, String value) {
        if (value == null || value.isBlank()) {
            missing.add(field);
        }
    }
}
