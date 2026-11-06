package com.techx.intervue.common.taxcode;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.techx.intervue.config.TaxLookupProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Slf4j
@Service
public class VietQrTaxCodeLookup implements TaxCodeLookupInterface {

    private static final String SUCCESS_CODE = "00";

    private final RestClient restClient;
    private final TaxLookupProperties properties;

    public VietQrTaxCodeLookup(
            @Qualifier("taxLookupRestClient") RestClient restClient,
            TaxLookupProperties properties) {
        this.restClient = restClient;
        this.properties = properties;
    }

    @Override
    public Optional<TaxCodeRecord> find(String taxCode) {
        VietQrResponse response = fetch(TaxCodes.registryCode(taxCode));
        if (response == null || !SUCCESS_CODE.equals(response.code()) || response.data() == null) {
            return Optional.empty();
        }
        String name = response.data().name();
        if (name == null || name.isBlank()) {
            return Optional.empty();
        }
        return Optional.of(new TaxCodeRecord(taxCode, name.trim(), response.data().address()));
    }

    private VietQrResponse fetch(String registryCode) {
        try {
            return restClient
                    .get()
                    .uri("/v2/business/{taxCode}", registryCode)
                    .retrieve()
                    .body(VietQrResponse.class);
        } catch (RestClientResponseException e) {
            log.warn("Tax lookup rejected {}: HTTP {}", registryCode, e.getStatusCode().value());
            if (e.getStatusCode().isSameCodeAs(HttpStatus.TOO_MANY_REQUESTS)) {
                throw AppException.rateLimited(
                        ErrorCode.TAX_LOOKUP_BUSY, properties.retryAfter().toSeconds());
            }
            throw new AppException(ErrorCode.TAX_LOOKUP_UNAVAILABLE);
        } catch (RestClientException e) {
            log.warn("Tax lookup failed for {}: {}", registryCode, e.getMessage());
            throw new AppException(ErrorCode.TAX_LOOKUP_UNAVAILABLE);
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record VietQrResponse(String code, VietQrData data) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record VietQrData(String name, String address) {}
}
