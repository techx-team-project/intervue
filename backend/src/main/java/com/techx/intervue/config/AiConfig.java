package com.techx.intervue.config;

import java.net.http.HttpClient;
import java.time.Duration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class AiConfig {

    @Bean
    RestClient geminiRestClient(AiProperties properties) {
        AiProperties.Gemini gemini = properties.gemini();
        return restClient(gemini.baseUrl(), gemini.timeout());
    }

    @Bean
    RestClient openAiRestClient(AiProperties properties) {
        AiProperties.OpenAi openAi = properties.openai();
        return restClient(openAi.baseUrl(), openAi.timeout());
    }

    private RestClient restClient(String baseUrl, Duration timeout) {
        JdkClientHttpRequestFactory requestFactory =
                new JdkClientHttpRequestFactory(
                        HttpClient.newBuilder().connectTimeout(timeout).build());
        requestFactory.setReadTimeout(timeout);
        return RestClient.builder().baseUrl(baseUrl).requestFactory(requestFactory).build();
    }
}
