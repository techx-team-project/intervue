package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.recruiter.mappers.RecruiterMapper;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterService implements RecruiterServiceInterface {

    private final RecruiterRepository recruiterRepository;
    private final RecruiterMapper recruiterMapper;

    @Override
    @Transactional(readOnly = true)
    public RecruiterResource getMe(Long recruiterId) {
        return recruiterRepository
                .findById(recruiterId)
                .map(recruiterMapper::toResource)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    }
}
