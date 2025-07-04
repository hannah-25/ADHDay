package hannah.mind.ADHDay.user.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private boolean success;
    private String token;  // JWT 토큰을 위한 필드 추가
}