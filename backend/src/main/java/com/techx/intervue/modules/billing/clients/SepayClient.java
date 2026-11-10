package com.techx.intervue.modules.billing.clients;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.techx.intervue.config.SepayProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Slf4j
@Component
public class SepayClient implements SepayClientInterface {

    private static final String LIST_PATH = "/userapi/transactions/list";
    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter SEPAY_MOMENT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final RestClient restClient;
    private final SepayProperties properties;

    public SepayClient(
            @Qualifier("sepayRestClient") RestClient restClient, SepayProperties properties) {
        this.restClient = restClient;
        this.properties = properties;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ListResponse(Integer status, List<SepayTransaction> transactions) {}

    @Override
    public boolean isConfigured() {
        return properties.apiToken() != null && !properties.apiToken().isBlank();
    }

    @Override
    public List<SepayTransaction> listTransactions(String accountNumber, int limit, Instant since) {
        if (!isConfigured()) {
            throw new AppException(ErrorCode.PAYMENT_NOT_CONFIGURED);
        }
        ListResponse response;
        try {
            response =
                    restClient
                            .get()
                            .uri(
                                    builder -> {
                                        builder.path(LIST_PATH)
                                                .queryParam("account_number", accountNumber)
                                                .queryParam("limit", limit);
                                        if (since != null) {
                                            builder.queryParam(
                                                    "transaction_date_min",
                                                    SEPAY_MOMENT.format(
                                                            since.atZone(VIETNAM)
                                                                    .toLocalDateTime()));
                                        }
                                        return builder.build();
                                    })
                            .header("Authorization", "Bearer " + properties.apiToken())
                            .retrieve()
                            .body(ListResponse.class);
        } catch (RestClientException cause) {
            log.warn("SePay transaction list request failed", cause);
            throw new AppException(ErrorCode.PAYMENT_PROVIDER_ERROR);
        }
        if (response == null || response.status() == null || response.status() != 200) {
            throw new AppException(ErrorCode.PAYMENT_PROVIDER_ERROR);
        }
        return response.transactions() == null ? List.of() : response.transactions();
    }
}
