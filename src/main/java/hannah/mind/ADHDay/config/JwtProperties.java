package hannah.mind.ADHDay.config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties("jwt")
// application.yml 또는 application.properties에서 jwt: 로 시작하는 설정값들을 자동으로 이 클래스 필드에 매핑해준다.
public class JwtProperties {
    private String issuer;
    private String secretKey;
    private long accessTokenExpirationMinutes;
    private long refreshTokenExpirationDays;
}
