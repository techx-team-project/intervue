package com.techx.intervue.config;

import java.net.http.HttpClient;
import java.time.Duration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class SepayConfig {

    private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(15);

    @Bean
    RestClient sepayRestClient(SepayProperties properties) {
        Duration timeout = properties.timeout() == null ? DEFAULT_TIMEOUT : properties.timeout();
        JdkClientHttpRequestFactory requestFactory =
                new JdkClientHttpRequestFactory(
                        HttpClient.newBuilder().connectTimeout(timeout).build());
        requestFactory.setReadTimeout(timeout);
        return RestClient.builder()
                .baseUrl(properties.baseUrl())
                .requestFactory(requestFactory)
                .build();
    }
}
