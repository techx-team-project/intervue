package com.techx.intervue.modules.company.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.company.requests.JoinCompanyRequest;
import com.techx.intervue.modules.company.requests.SaveCompanyProfileRequest;
import com.techx.intervue.modules.company.requests.SearchCompaniesRequest;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import com.techx.intervue.modules.company.resources.TaxLookupResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface CompanyServiceInterface {

    CompanyResource findMyCompany(Long userId);

    CompanyResource create(SaveCompanyProfileRequest request, RequestActor actor);

    CompanyResource update(SaveCompanyProfileRequest request, RequestActor actor);

    Page<CompanySummaryResource> search(SearchCompaniesRequest request, Pageable pageable);

    CompanyResource join(JoinCompanyRequest request, RequestActor actor);

    void leave(RequestActor actor);

    CompanyResource replaceLogo(MultipartFile file, Long userId);

    TaxLookupResource lookupTax(String taxCode);

    CompanyResource addPhotos(List<MultipartFile> files, Long userId);

    CompanyResource removePhoto(Long photoId, Long userId);
}
