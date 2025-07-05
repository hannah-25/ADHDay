package hannah.mind.ADHDay.auth.jwt;

import hannah.mind.ADHDay.config.JwtProperties;
import hannah.mind.ADHDay.domain.account.Account;
import hannah.mind.ADHDay.domain.account.AccountRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Duration;
import java.util.Date;


@RequiredArgsConstructor
@Component
public class TokenProvider {

    private final JwtProperties jwtProperties;
    private final AccountRepository accountRepository;


    //`Keys.hmacShaKeyFor()`: HMAC-SHA 알고리즘에 사용할 수 있는 키 객체를 생성
    // `.getBytes()`: 비밀키 문자열을 바이트 배열
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());
    }


    // ✅ Access Token 전용
    public String generateAccessToken(Account account) {
        Date now = new Date();
        long expiryMs = now.getTime() + Duration.ofMinutes(30).toMillis();
        return makeToken(account, new Date(expiryMs), true);
    }

    // ✅ Refresh Token 전용
    public String generateRefreshToken(Account account) {
        Date now = new Date();
        long expiryMs = now.getTime() + Duration.ofDays(7).toMillis();
        return makeToken(account, new Date(expiryMs), false);
    }

    // ✅ 공통 빌더
    private String makeToken(Account account, Date expiry, boolean isAccessToken) {
        Date now = new Date();

        JwtBuilder builder = Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)

                .setIssuer(jwtProperties.getIssuer())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .setSubject(account.getEmail())

                .claim("id", account.getId());

        if (isAccessToken) {
            // Access Token은 roles 포함!
            builder.claim("roles", account.getAuthorities());
        }

        return builder.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
    }

    // 유효성 검증
    // token이 비밀키로 파싱이 되는가! 형식을 잘 지켰는가!
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Authentication (= UsernamePasswordAuthenticationToken) 발급!
    public Authentication getAuthentication(String token) {

        // token에서 claim만 가져오기!
        Claims claims = getClaims(token);

        // TO-BE
        Account account = accountRepository.findByEmail(claims.getSubject())
                .orElseThrow(() -> new UsernameNotFoundException("토큰의 사용자가 더 이상 존재하지 않습니다")); // ✅

        // UsernamePasswordAuthenticationToken(계정, 토큰, 권한(simpleGrantedAuthority) ) 발급!
        return new UsernamePasswordAuthenticationToken(
                account,token, account.getAuthorities());
    }

    // 유저 ID 추출
    public Long getUserId(String token) {
        Claims claims = getClaims(token);
        return claims.get("id", Long.class);
    }

    // Claims 추출
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey()) // ✅ Key 객체로!
                .parseClaimsJws(token)
                .getBody();
    }
}