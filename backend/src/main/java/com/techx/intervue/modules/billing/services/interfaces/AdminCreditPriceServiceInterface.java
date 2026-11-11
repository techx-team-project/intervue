package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.billing.requests.SaveCreditPriceRequest;
import com.techx.intervue.modules.billing.resources.CreditPriceResource;
import java.util.List;

public interface AdminCreditPriceServiceInterface {

    List<CreditPriceResource> list();

    CreditPriceResource update(Long id, SaveCreditPriceRequest request, RequestActor actor);
}
