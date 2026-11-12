package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.requests.ConvertCreditsRequest;
import com.techx.intervue.modules.billing.resources.CreditLedgerEntryResource;
import com.techx.intervue.modules.billing.resources.CreditWalletResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CreditServiceInterface {

    CreditWalletResource getWallet(Long recruiterId);

    CreditWalletResource convert(Long recruiterId, ConvertCreditsRequest request);

    Page<CreditLedgerEntryResource> ledger(Long recruiterId, Pageable pageable);
}
