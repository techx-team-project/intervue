package com.techx.intervue.config;

import com.cloudinary.Cloudinary;
import java.net.http.HttpClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class StorageConfig {

    @Bean
    @ConditionalOnExpression("'${storage.cloudinary-url:}' != ''")
    Cloudinary cloudinary(StorageProperties properties) {
        return new Cloudinary(properties.cloudinaryUrl());
    }

    @Bean
    RestClient cloudinaryRestClient(StorageProperties properties) {
        JdkClientHttpRequestFactory requestFactory =
                new JdkClientHttpRequestFactory(
                        HttpClient.newBuilder().connectTimeout(properties.fetchTimeout()).build());
        requestFactory.setReadTimeout(properties.fetchTimeout());
        return RestClient.builder().requestFactory(requestFactory).build();
    }
}
