package com.techx.intervue.modules.billing.clients;

import java.time.Instant;
import java.util.List;

public interface SepayClientInterface {

    boolean isConfigured();

    List<SepayTransaction> listTransactions(String accountNumber, int limit, Instant since);
}
