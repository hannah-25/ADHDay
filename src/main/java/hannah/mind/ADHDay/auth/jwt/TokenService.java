package hannah.mind.ADHDay.auth.jwt;

import hannah.mind.ADHDay.domain.account.Account;
import hannah.mind.ADHDay.domain.account.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class TokenService {

    private final JwtTokenProvider jwtTokenProvider;
    private final AccountService accountService;


    // 리프레시 토큰이 유효함 -> 액세스 토큰 생성
    public String createNewAccessToken(String refreshToken){
        if(!jwtTokenProvider.validateToken(refreshToken)){
            throw new IllegalArgumentException("Invalid refresh token");
        }

        Long userId = jwtTokenProvider.getUserId(refreshToken);
        Account account = accountService.findById(userId);

        // 새로운 액세스 토큰 생성
        return jwtTokenProvider.generateAccessToken(account);

    }
}
