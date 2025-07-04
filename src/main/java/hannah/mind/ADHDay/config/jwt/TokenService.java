package hannah.mind.ADHDay.config.jwt;

import hannah.mind.ADHDay.config.jwt.refreshToken.RefreshTokenService;
import hannah.mind.ADHDay.user.User;
import hannah.mind.ADHDay.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

@RequiredArgsConstructor
@Service
public class TokenService {

    private final TokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;


    // 리프레시 토큰이 유효함 -> 액세스 토큰 생성
    public String createNewAccessToken(String refreshToken){
        if(!tokenProvider.validateToken(refreshToken)){
            throw new IllegalArgumentException("Invalid refresh token");
        }

        Long userId = refreshTokenService.findByRefreshToken(refreshToken).getUserId();
        User user = userService.findById(userId);

        // 새로운 액세스 토큰 생성
        return tokenProvider.generateToken(user, Duration.ofHours(2));

    }
}
