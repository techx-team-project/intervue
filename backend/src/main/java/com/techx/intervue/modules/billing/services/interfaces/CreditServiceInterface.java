package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.requests.ConvertCreditsRequest;
import com.techx.intervue.modules.billing.resources.CreditWalletResource;

public interface CreditServiceInterface {

    CreditWalletResource getWallet(Long recruiterId);

    CreditWalletResource convert(Long recruiterId, ConvertCreditsRequest request);
}
