package hannah.mind.ADHDay.config.jwt.refreshToken;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    // 리프레시 토큰 문자열 기반 db 검색 ->  RefreshToken 엔티티(예: id, token 값, userId 등)를 리턴
    public RefreshToken findByRefreshToken(String refreshToken){
        return refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(()-> new IllegalArgumentException("Unexpected token"));
    }

    public void deleteRefreshToken(Long userId){
        refreshTokenRepository.deleteByUserId(userId);
    }
}
