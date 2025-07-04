package hannah.mind.ADHDay.config.jwt;

import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Builder;
import lombok.Getter;

import java.security.Key;
import java.time.Duration;
import java.util.Date;
import java.util.Map;

import static java.util.Collections.emptyMap;

@Getter
public class JwtFactory {

    private String subject = "test@email.com";
    private Date issuedAt = new Date();
    private Date expiration = new Date(new Date().getTime() + Duration.ofDays(14).toMillis());
    private Map<String, Object> claims = emptyMap();

    @Builder
    public JwtFactory(String subject, Date issuedAt, Date expiration, Map<String, Object> claims) {
        this.subject = subject != null ? subject : this.subject;
        this.issuedAt = issuedAt != null ? issuedAt : this.issuedAt;
        this.expiration = expiration != null ? expiration : this.expiration;
        this.claims = claims != null ? claims : this.claims;
    }




    public String createToken(JwtProperties jwtProperties) {
        // Key 객체로!
        Key key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());

        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)

                .setIssuer(jwtProperties.getIssuer())
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)

                .setSubject(subject)

                // 이부분이 tokenProvider의 generateToken 과 다르군 (id, roles)
                .addClaims(claims)

                .signWith(key, SignatureAlgorithm.HS256) // Key 객체로 서명
                .compact();
    }
}
