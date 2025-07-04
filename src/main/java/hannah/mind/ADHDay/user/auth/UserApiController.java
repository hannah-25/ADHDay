package hannah.mind.ADHDay.user.auth;

import hannah.mind.ADHDay.config.jwt.TokenProvider;
import hannah.mind.ADHDay.config.jwt.refreshToken.RefreshTokenService;
import hannah.mind.ADHDay.user.User;
import hannah.mind.ADHDay.user.UserService;
import hannah.mind.ADHDay.user.auth.dto.AddUserRequest;
import hannah.mind.ADHDay.user.auth.dto.AuthResponse;
import hannah.mind.ADHDay.user.auth.dto.LoginRequest;
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

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserApiController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@RequestBody @Valid AddUserRequest request) {
        try {
            User user = userService.registerUser(request);

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(),request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenProvider.generateToken(user, Duration.ofMinutes(30));

            return ResponseEntity.ok(new AuthResponse("회원가입이 성공적으로 완료되었습니다.", true, token));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .badRequest()
                .body(new AuthResponse(e.getMessage(), false, null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                            request.getEmail(),request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userService.findByEmail(((CustomUserDetails) authentication.getPrincipal()).getUsername());
            String token = tokenProvider.generateToken(user, Duration.ofMinutes(30));

            return ResponseEntity.ok(new AuthResponse("로그인이 성공적으로 완료되었습니다.", true, token));

        } catch (AuthenticationException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse("로그인에 실패했습니다.", false, null));
        }
    }

    // 로그아웃 엔드포인트는 제거 (JWT는 클라이언트에서 토큰을 삭제하면 됨)
    @PostMapping("/logout")
    public ResponseEntity<String> logout(Authentication authentication) {
        String userEmail = ((CustomUserDetails) authentication.getPrincipal()).getUsername();
        Long userId = userService.findByEmail(userEmail).getId();
        refreshTokenService.deleteRefreshToken(userId);

        return ResponseEntity.ok("로그아웃 성공!");
    }
}