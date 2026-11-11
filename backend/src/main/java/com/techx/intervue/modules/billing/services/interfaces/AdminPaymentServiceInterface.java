package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.billing.enums.PaymentTransactionStatus;
import com.techx.intervue.modules.billing.requests.MatchPaymentTransactionRequest;
import com.techx.intervue.modules.billing.requests.SaveBillingSettingsRequest;
import com.techx.intervue.modules.billing.resources.BillingSettingsResource;
import com.techx.intervue.modules.billing.resources.PaymentTransactionResource;
import com.techx.intervue.modules.billing.resources.SupportedBankResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminPaymentServiceInterface {

    List<SupportedBankResource> supportedBanks();

    BillingSettingsResource getSettings();

    BillingSettingsResource updateSettings(SaveBillingSettingsRequest request, RequestActor actor);

    Page<PaymentTransactionResource> searchTransactions(
            PaymentTransactionStatus status, Pageable pageable);

    PaymentTransactionResource matchTransaction(
            Long id, MatchPaymentTransactionRequest request, RequestActor actor);
}
