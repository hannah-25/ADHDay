package hannah.mind.ADHDay.config.jwt;

import hannah.mind.ADHDay.user.User;
import hannah.mind.ADHDay.user.auth.CustomUserDetails;
import hannah.mind.ADHDay.user.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class TokenProvider {

    private final JwtProperties jwtProperties;
    private final UserRepository userRepository;


    //`Keys.hmacShaKeyFor()`: HMAC-SHA 알고리즘에 사용할 수 있는 키 객체를 생성
    // `.getBytes()`: 비밀키 문자열을 바이트 배열
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());
    }



    // 외부 api 공개용 토큰 생성 - 만료시간 계산!
    public String generateToken(User user, Duration expiredAt) {
        Date now = new Date();
        return makeToken(new Date(now.getTime() + expiredAt.toMillis()), user);
    }

    // JWT 토큰 생성 로직 담당
    private String makeToken(Date expiry, User user) {
        Date now = new Date();

        return Jwts.builder()

                // 등록된 클레임 - sub, iss, exp, iat, aud, jti
                //헤더
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)

                //발행인
                .setIssuer(jwtProperties.getIssuer())
                // 기간
                .setIssuedAt(now)
                .setExpiration(expiry)

                // 이메일, id, roles
                .setSubject(user.getEmail())

                // claim() 메서드 -> 비공개 클레임
                .claim("id", user.getId())
                .claim("roles", user.getRoles())

                //서명 알고리즘 지정 -> HS256
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // ✅ Key 객체로!
                .compact();
    }

    // 유효성 검증
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

    // Authentication 생성
    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);

        // TO-BE
        User user = userRepository.findByEmail(claims.getSubject())
                .orElseThrow(() -> new UsernameNotFoundException("토큰의 사용자가 더 이상 존재하지 않습니다")); // ✅

        // 권한 꺼내기
        List<String> roles = claims.get("roles", List.class);
        Set<SimpleGrantedAuthority> authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        CustomUserDetails userDetails = new CustomUserDetails(user,authorities);

        return new UsernamePasswordAuthenticationToken(
                userDetails,token, userDetails.getAuthorities());
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