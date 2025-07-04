package hannah.mind.ADHDay.config.jwt.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateAccessTokenResponse {
    private String accessToken;
}
