package hannah.mind.ADHDay.domain.account.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private boolean success;
    private String accessToken;   // 액세스 토큰
    private String refreshToken;  // 리프레시 토큰
}