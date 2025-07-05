package hannah.mind.ADHDay.config.jwt;

import hannah.mind.ADHDay.config.JwtProperties;
import hannah.mind.ADHDay.auth.jwt.TokenProvider;
import hannah.mind.ADHDay.domain.account.Account;
import hannah.mind.ADHDay.domain.account.AccountRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import java.security.Key;
import java.time.Duration;
import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class TokenProviderTest {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private JwtProperties jwtProperties;

    @Autowired
    private AccountRepository accountRepository;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());
    }

    @DisplayName("generateToken() : 유저 정보와 만료 기간을 전달해 토큰을 만들수 있다.")
    @Test
    void generateToken() {
        // given
        Account testUser = accountRepository.save(Account.builder()
                .email("user@gmail.com")
                .password("1234")
                .build());

        // when
        String token = tokenProvider.generateToken(testUser, Duration.ofDays(14));

        // then
        Long userId = Jwts.parser()
                .setSigningKey(getSigningKey()) // ✅ Key 객체!
                .parseClaimsJws(token)
                .getBody()
                .get("id", Long.class);

        assert userId.equals(testUser.getId());
    }

    @DisplayName("validToken() : 만료된 토큰인 때에 유효성 검증에 실패한다.")
    @Test
    void validToken_invalidToken() {

        String token = JwtFactory.builder()
                .expiration(new Date(new Date().getTime() - Duration.ofDays(7).toMillis()))
                .build()
                .createToken(jwtProperties);

        boolean result = tokenProvider.validateToken(token);

        assertThat(result).isFalse();
    }

    @DisplayName("getAuthentication() : 토큰 기반으로 인증 정보를 가져올 수 있다")
    @Test
    void getAuthentication() {

        String userEmail = "user2@gmail.com";
//
//        String token = JwtFactory.builder()
//                .subject(userEmail)
//                .build()
//                .createToken(jwtProperties);

        Account testUser = accountRepository.save(Account.builder()
                .email(userEmail)
                .password("1234")
                .build());

        // when
        String token = tokenProvider.generateToken(testUser, Duration.ofDays(14));
        Authentication authentication = tokenProvider.getAuthentication(token);

        assertThat(((UserDetails) authentication.getPrincipal()).getUsername()).isEqualTo(userEmail);
    }

    @DisplayName("getUserId() : 토큰으로 유저 ID를 가져올 수 있다.")
    @Test
    void getUserId() {


        Long userId = 1L;
        String token = JwtFactory.builder()
                .claims(Map.of("id", userId))
                .build()
                .createToken(jwtProperties);

        Long userIdByToken = tokenProvider.getUserId(token);

        assertThat(userIdByToken).isEqualTo(userId);
    }

}
