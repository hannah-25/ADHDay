package hannah.mind.ADHDay.auth.jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class CreateAccessTokenRequest {
    private String refreshToken;
}
