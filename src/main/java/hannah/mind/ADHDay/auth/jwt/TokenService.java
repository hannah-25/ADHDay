package hannah.mind.ADHDay.auth.jwt;

import hannah.mind.ADHDay.domain.account.Account;
import hannah.mind.ADHDay.domain.account.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

@RequiredArgsConstructor
@Service
public class TokenService {

    private final TokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final AccountService accountService;


    // 리프레시 토큰이 유효함 -> 액세스 토큰 생성
    public String createNewAccessToken(String refreshToken){
        if(!tokenProvider.validateToken(refreshToken)){
            throw new IllegalArgumentException("Invalid refresh token");
        }

        Long userId = refreshTokenService.findByRefreshToken(refreshToken).getUserId();
        Account account = accountService.findById(userId);

        // 새로운 액세스 토큰 생성
        return tokenProvider.generateAccessToken(account);

    }
}
