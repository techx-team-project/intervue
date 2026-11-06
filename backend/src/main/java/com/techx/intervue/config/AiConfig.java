package com.techx.intervue.config;

import java.net.http.HttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class AiConfig {

    @Bean
    RestClient geminiRestClient(AiProperties properties) {
        AiProperties.Gemini gemini = properties.gemini();
        JdkClientHttpRequestFactory requestFactory =
                new JdkClientHttpRequestFactory(
                        HttpClient.newBuilder().connectTimeout(gemini.timeout()).build());
        requestFactory.setReadTimeout(gemini.timeout());
        return RestClient.builder()
                .baseUrl(gemini.baseUrl())
                .requestFactory(requestFactory)
                .build();
    }
}
