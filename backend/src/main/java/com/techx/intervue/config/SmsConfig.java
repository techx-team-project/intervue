package com.techx.intervue.config;

import java.net.http.HttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class SmsConfig {

    @Bean
    RestClient esmsRestClient(SmsProperties properties) {
        SmsProperties.Esms esms = properties.esms();
        JdkClientHttpRequestFactory requestFactory =
                new JdkClientHttpRequestFactory(
                        HttpClient.newBuilder().connectTimeout(esms.timeout()).build());
        requestFactory.setReadTimeout(esms.timeout());
        return RestClient.builder().baseUrl(esms.baseUrl()).requestFactory(requestFactory).build();
    }
}
