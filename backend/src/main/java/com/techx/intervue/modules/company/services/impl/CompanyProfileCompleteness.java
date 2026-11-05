package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.modules.company.entities.Company;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CompanyProfileCompleteness {

    private static final int MIN_DESCRIPTION_LENGTH = 20;

    public List<String> missingFields(Company company) {
        List<String> missing = new ArrayList<>();
        requireText(missing, "name", company.getName());
        requireText(missing, "taxCode", company.getTaxCode());
        requireText(missing, "size", company.getSize());
        requireText(missing, "address", company.getAddress());
        requireText(missing, "email", company.getEmail());
        if (company.getBusinessType() == null) {
            missing.add("businessType");
        }
        if (company.getDescription() == null
                || company.getDescription().trim().length() < MIN_DESCRIPTION_LENGTH) {
            missing.add("description");
        }
        return List.copyOf(missing);
    }

    public boolean isComplete(Company company) {
        return missingFields(company).isEmpty();
    }

    private void requireText(List<String> missing, String field, String value) {
        if (value == null || value.isBlank()) {
            missing.add(field);
        }
    }
}
