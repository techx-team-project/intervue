package com.techx.intervue.common.sms;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.techx.intervue.config.SmsProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Slf4j
@Service
@Profile("!local")
public class EsmsSender implements SmsSenderInterface {

    private static final String SEND_PATH =
            "/MainService.svc/json/SendMultipleMessage_V4_post_json";
    private static final String SUCCESS_CODE = "100";

    private final RestClient restClient;
    private final SmsProperties.Esms config;

    public EsmsSender(
            @Qualifier("esmsRestClient") RestClient restClient, SmsProperties properties) {
        this.restClient = restClient;
        this.config = properties.esms();
    }

    @Override
    public void send(String phone, String message) {
        requireConfigured();
        SendRequest body =
                new SendRequest(
                        config.apiKey(),
                        config.secretKey(),
                        config.brandname(),
                        phone,
                        message,
                        config.smsType());
        SendResponse response;
        try {
            response =
                    restClient.post().uri(SEND_PATH).body(body).retrieve().body(SendResponse.class);
        } catch (RestClientException e) {
            log.error("eSMS could not be reached: {}", e.getClass().getSimpleName());
            throw new AppException(ErrorCode.SMS_UNAVAILABLE);
        }
        if (response == null || !SUCCESS_CODE.equals(response.codeResult())) {
            log.error(
                    "eSMS rejected the message: code={}",
                    response == null ? "no-response" : response.codeResult());
            throw new AppException(ErrorCode.SMS_UNAVAILABLE);
        }
    }

    private void requireConfigured() {
        if (isBlank(config.apiKey())
                || isBlank(config.secretKey())
                || isBlank(config.brandname())) {
            log.error(
                    "eSMS is not configured; set ESMS_API_KEY, ESMS_SECRET_KEY and ESMS_BRANDNAME");
            throw new AppException(ErrorCode.SMS_UNAVAILABLE);
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    record SendRequest(
            @JsonProperty("ApiKey") String apiKey,
            @JsonProperty("SecretKey") String secretKey,
            @JsonProperty("Brandname") String brandname,
            @JsonProperty("Phone") String phone,
            @JsonProperty("Content") String content,
            @JsonProperty("SmsType") String smsType) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record SendResponse(
            @JsonProperty("CodeResult") String codeResult, @JsonProperty("SMSID") String smsId) {}
}
