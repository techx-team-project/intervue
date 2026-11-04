package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.enums.AccountType;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import io.jsonwebtoken.Claims;
import java.util.Map;

public interface JwtServiceInterface {
    public String generateToken(Long accountId, AccountType accountType);

    public boolean isTokenValid(String token, CustomUserDetails userDetails);

    public boolean isTokenExpired(String token);

    public Long extractSubject(String token);

    public AccountType extractAccountType(String token);

    public String extractJti(String token);

    public Map<String, Object> extractRevoke(String token);

    public Claims extractAllClaims(String token);
}
