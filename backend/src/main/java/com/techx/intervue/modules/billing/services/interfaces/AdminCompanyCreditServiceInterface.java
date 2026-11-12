package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.billing.requests.AdjustCompanyCreditsRequest;
import com.techx.intervue.modules.billing.resources.AdminCompanyCreditDetailResource;
import com.techx.intervue.modules.billing.resources.AdminCompanyCreditSummaryResource;
import com.techx.intervue.modules.billing.resources.CreditLedgerEntryResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminCompanyCreditServiceInterface {

    Page<AdminCompanyCreditSummaryResource> listCompanies(String query, Pageable pageable);

    AdminCompanyCreditDetailResource getCompanyWallet(Long companyId);

    Page<CreditLedgerEntryResource> companyLedger(Long companyId, Pageable pageable);

    AdminCompanyCreditDetailResource adjustCredits(
            Long companyId, AdjustCompanyCreditsRequest request, RequestActor actor);
}
