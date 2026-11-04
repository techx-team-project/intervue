package com.techx.intervue.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.filters.JwtAuthFilter;
import com.techx.intervue.filters.TraceIdFilter;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.ErrorResource;
import com.techx.intervue.resources.FieldErrorResource;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@AllArgsConstructor
@Configuration
@EnableMethodSecurity // phần quyền dựa trên method (còn default là phân quyền theo url)
public class SecurityConfig {

    private final ObjectMapper objectMapper;
    private final JwtAuthFilter jwtAuthFilter;
    private final TraceIdFilter traceIdFilter;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(
                        auth ->
                                auth
                                        // 1. Route AUTH - No JWT
                                        .requestMatchers("/api/v1/auth/**")
                                        .permitAll()
                                        // Ping - health check
                                        .requestMatchers("/ping")
                                        .permitAll()
                                        // 2. Public API
                                        .requestMatchers("/api/v1/ai/chat")
                                        .permitAll()
                                        .requestMatchers("/api/v1/products")
                                        .permitAll()
                                        // 2. Admin area
                                        .requestMatchers("/api/v1/admin/**")
                                        .hasRole("ADMIN")
                                        .anyRequest()
                                        .authenticated())
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(
                        ex ->
                                ex.authenticationEntryPoint(
                                                (request, response, authException) ->
                                                        writeError(
                                                                response,
                                                                HttpServletResponse.SC_UNAUTHORIZED,
                                                                "UNAUTHORIZED",
                                                                authException.getMessage(),
                                                                "An unexpected error occurred, please try again later!"))
                                        .accessDeniedHandler(
                                                (request, response, deniedException) ->
                                                        writeError(
                                                                response,
                                                                HttpServletResponse.SC_FORBIDDEN,
                                                                ErrorCode.FORBIDDEN.name(),
                                                                deniedException.getMessage(),
                                                                ErrorCode.FORBIDDEN.getMessage())))
                // UsernamePasswordAuthenticationFilter.class chỉ làm mốc để tham chiếu
                // sau khi chạy qua jwtAuthFiler thì nó sẽ chạy qua bên
                // UsernamePasswordAuthenticationFilter.class (chạy nma ko làm gì)
                // cần phải có 2 tham số
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(traceIdFilter, JwtAuthFilter.class);

        return http.build();
    }

    // Writes the envelope directly instead of sendError, so the container does not
    // re-dispatch to /error and overwrite the status with the entry point response.
    private void writeError(
            HttpServletResponse response, int status, String code, String detail, String message)
            throws IOException {
        ErrorResource error =
                ErrorResource.builder()
                        .code(code)
                        .details(List.of(FieldErrorResource.builder().message(detail).build()))
                        .build();

        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter()
                .write(objectMapper.writeValueAsString(ApiResource.error(error, message)));
    }
}
