package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.repositories.CompanyRepository;
import com.techx.intervue.modules.entitlement.services.interfaces.CompanyBrandPortInterface;
import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CompanyBrandAdapter implements CompanyBrandPortInterface {

    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public void grantFeatured(Long companyId, Instant until) {
        // Buying again while a window is open extends it instead of restarting it
        apply(
                companyId,
                company -> company.setFeaturedUntil(later(company.getFeaturedUntil(), until)));
    }

    @Override
    @Transactional
    public void grantBrandPage(Long companyId, Instant until) {
        apply(
                companyId,
                company -> company.setBrandPageUntil(later(company.getBrandPageUntil(), until)));
    }

    private Instant later(Instant current, Instant candidate) {
        if (candidate == null) {
            return current;
        }
        return current == null || current.isBefore(Instant.now()) || current.isBefore(candidate)
                ? candidate
                : current;
    }

    private void apply(Long companyId, java.util.function.Consumer<Company> mutation) {
        Optional<Company> found = companyRepository.findById(companyId);
        found.ifPresent(mutation);
    }
}
