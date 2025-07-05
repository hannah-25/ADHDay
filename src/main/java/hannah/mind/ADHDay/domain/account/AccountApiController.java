package hannah.mind.ADHDay.domain.account;

import hannah.mind.ADHDay.auth.jwt.RefreshToken;
import hannah.mind.ADHDay.auth.jwt.TokenProvider;
import hannah.mind.ADHDay.auth.jwt.RefreshTokenService;
import hannah.mind.ADHDay.domain.account.dto.AuthRequest;
import hannah.mind.ADHDay.domain.account.dto.AuthResponse;
import hannah.mind.ADHDay.domain.account.dto.LoginRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AccountApiController {

    private final AccountService accountService;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@RequestBody @Valid AuthRequest request) {
        try {
            Account account = accountService.registerAccount(request);

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(),request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = tokenProvider.generateAccessToken(account);

            String refreshToken = tokenProvider.generateRefreshToken(account);
            refreshTokenService.saveRefreshToken(new RefreshToken(account.getId(), refreshToken));

            return ResponseEntity.ok(new AuthResponse("ADHDay의 회원이 되신 걸 환영합니다",
                    true, accessToken, refreshToken));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .badRequest()
                .body(new AuthResponse(e.getMessage(), false, null, null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                            request.getEmail(),request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Account account = accountService.findByEmail(request.getEmail());

            String accessToken = tokenProvider.generateAccessToken(account);

            String refreshToken = tokenProvider.generateRefreshToken(account);
            refreshTokenService.saveRefreshToken(new RefreshToken(account.getId(), refreshToken));

            return ResponseEntity.ok(new AuthResponse("로그인이 성공적으로 완료되었습니다.",
                    true, accessToken, refreshToken));

        } catch (AuthenticationException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse("로그인에 실패했습니다.", false, null,null));
        }
    }

    // 로그아웃 엔드포인트는 제거 (JWT는 클라이언트에서 토큰을 삭제하면 됨)
    @PostMapping("/logout")
    public ResponseEntity<String> logout(Authentication authentication) {
        Long userId = ((Account)authentication.getPrincipal()).getId();
        refreshTokenService.deleteRefreshToken(userId);

        return ResponseEntity.ok("로그아웃 성공!");
    }
}