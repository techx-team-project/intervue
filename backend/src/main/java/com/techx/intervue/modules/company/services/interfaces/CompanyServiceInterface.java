package com.techx.intervue.modules.company.services.interfaces;

import com.techx.intervue.modules.company.requests.JoinCompanyRequest;
import com.techx.intervue.modules.company.requests.SaveCompanyProfileRequest;
import com.techx.intervue.modules.company.requests.SearchCompaniesRequest;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface CompanyServiceInterface {

    record RecruiterActor(Long userId, String email, String ip) {}

    CompanyResource findMyCompany(Long userId);

    CompanyResource create(SaveCompanyProfileRequest request, RecruiterActor actor);

    CompanyResource update(SaveCompanyProfileRequest request, RecruiterActor actor);

    Page<CompanySummaryResource> search(SearchCompaniesRequest request, Pageable pageable);

    CompanyResource join(JoinCompanyRequest request, RecruiterActor actor);

    void leave(RecruiterActor actor);

    CompanyResource replaceLogo(MultipartFile file, Long userId);

    CompanyResource addPhotos(List<MultipartFile> files, Long userId);

    CompanyResource removePhoto(Long photoId, Long userId);
}
