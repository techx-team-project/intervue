package com.techx.intervue.modules.connect.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ConnectCompanyScope {

    private final CompanyServiceInterface companyService;

    public Long companyIdOf(Long recruiterId) {
        try {
            return companyService.findMyCompany(recruiterId).id();
        } catch (AppException e) {
            if (e.getErrorCode() == ErrorCode.NOT_FOUND) {
                throw new AppException(ErrorCode.NOT_COMPANY_MEMBER);
            }
            throw e;
        }
    }
}
