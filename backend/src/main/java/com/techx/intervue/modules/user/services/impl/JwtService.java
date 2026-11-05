package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.modules.user.enums.AccountType;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.services.interfaces.JwtServiceInterface;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.*;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService implements JwtServiceInterface {
    private static final String ACCOUNT_TYPE_CLAIM = "typ";
    private static final String TOKEN_VERSION_CLAIM = "v";
    private static final String PURPOSE_CLAIM = "purp";
    private static final String PURPOSE_2FA = "2FA_PREAUTH";
    private static final long TEMP_TOKEN_DURATION_MS = 5 * 60 * 1000L; // 5 minutes

    private final Long expirationTime;
    private final String issuer;
    private final SecretKey key;

    public JwtService(AuthConfig authConfig) {
        expirationTime = authConfig.getExpirationTime();
        issuer = authConfig.getIssuer();
        this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(authConfig.getSecretKey()));
    }

    @Override
    public String generateTwoFactorTempToken(Long accountId, AccountType accountType) {
        Date now = new Date();
        Date expiredAt = new Date(now.getTime() + TEMP_TOKEN_DURATION_MS);

        return Jwts.builder()
                .subject(accountId.toString())
                .claim(ACCOUNT_TYPE_CLAIM, accountType.name())
                .claim(PURPOSE_CLAIM, PURPOSE_2FA)
                .claim("jti", UUID.randomUUID().toString())
                .issuer(issuer)
                .issuedAt(now)
                .expiration(expiredAt)
                .signWith(key)
                .compact();
    }

    // tạo ra jwt
    @Override
    public String generateToken(Long accountId, AccountType accountType) {
        return generateToken(accountId, accountType, 1);
    }

    @Override
    public String generateToken(Long accountId, AccountType accountType, Integer tokenVersion) {
        Date now = new Date();
        Date expiredAt = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(accountId.toString())
                .claim(ACCOUNT_TYPE_CLAIM, accountType.name())
                .claim(TOKEN_VERSION_CLAIM, tokenVersion != null ? tokenVersion : 1)
                .claim("jti", UUID.randomUUID().toString())
                .issuer(issuer)
                .issuedAt(now)
                .expiration(expiredAt)
                .signWith(key)
                .compact();
    }

    @Override
    public boolean isTokenValid(String token, CustomUserDetails userDetails) {
        Long userId = extractSubject(token);
        return userId.equals(userDetails.getId()) && !isTokenExpired(token);
    }

    // check token còn hsd k
    @Override
    public boolean isTokenExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    @Override
    public Long extractSubject(String token) {
        return Long.valueOf(extractClaim(token, Claims::getSubject));
    }

    @Override
    public AccountType extractAccountType(String token) {
        String raw = extractAllClaims(token).get(ACCOUNT_TYPE_CLAIM, String.class);
        return raw == null ? AccountType.USER : AccountType.valueOf(raw);
    }

    @Override
    public Integer extractTokenVersion(String token) {
        Object val = extractAllClaims(token).get(TOKEN_VERSION_CLAIM);
        if (val instanceof Number n) {
            return n.intValue();
        }
        return null;
    }

    @Override
    public String extractJti(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("jti", String.class);
    }

    @Override
    public Map<String, Object> extractRevoke(String token) {
        Claims claims = extractAllClaims(token);
        return Map.of(
                "jti",
                claims.get("jti", String.class),
                "expiresAt",
                claims.getExpiration().toInstant());
    }

    @Override
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) this.key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
}
