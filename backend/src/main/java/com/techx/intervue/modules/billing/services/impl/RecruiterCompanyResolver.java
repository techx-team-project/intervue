package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecruiterCompanyResolver {

    private final CompanyServiceInterface companyService;

    public CompanyResource require(Long recruiterId) {
        try {
            return companyService.findMyCompany(recruiterId);
        } catch (AppException cause) {
            if (cause.getErrorCode() == ErrorCode.NOT_FOUND) {
                throw new AppException(ErrorCode.NOT_COMPANY_MEMBER);
            }
            throw cause;
        }
    }

    public Long requireId(Long recruiterId) {
        return require(recruiterId).id();
    }

    public Optional<Long> findId(Long recruiterId) {
        try {
            return Optional.of(companyService.findMyCompany(recruiterId).id());
        } catch (AppException cause) {
            if (cause.getErrorCode() == ErrorCode.NOT_FOUND) {
                return Optional.empty();
            }
            throw cause;
        }
    }
}
