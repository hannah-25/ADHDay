package hannah.mind.ADHDay.domain.account;

import hannah.mind.ADHDay.auth.jwt.JwtTokenProvider;
import hannah.mind.ADHDay.config.JwtProperties;
import hannah.mind.ADHDay.domain.account.dto.AuthRequest;
import hannah.mind.ADHDay.domain.account.dto.AuthResponse;
import hannah.mind.ADHDay.domain.account.dto.LoginRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Account API", description = "계정 관리 API (회원가입, 로그인, 로그아웃)")
public class AccountApiController {

    private final AccountService accountService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;

    @Operation(summary = "회원가입", description = "새로운 사용자 계정을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터"),
            @ApiResponse(responseCode = "409", description = "이미 존재하는 이메일")
    })
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid AuthRequest request) {
        try {
            Account account = accountService.registerAccount(request);

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(),request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtTokenProvider.generateAccessToken(account);
            String refreshToken = jwtTokenProvider.generateRefreshToken(account);

            return ResponseEntity.ok(new AuthResponse("회원가입 성공!", true, accessToken, refreshToken));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @Operation(summary = "로그인", description = "사용자 로그인을 수행합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                            request.getEmail(),request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Account account = accountService.findByEmail(request.getEmail());

            String accessToken = jwtTokenProvider.generateAccessToken(account);
            String refreshToken = jwtTokenProvider.generateRefreshToken(account);

            return ResponseEntity.ok(new AuthResponse("로그인 성공!", true, accessToken, refreshToken));

        } catch (AuthenticationException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("로그인 실패!");
        }
    }

    @Operation(summary = "로그아웃", description = "사용자 로그아웃을 수행하고 토큰을 무효화합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그아웃 성공")
    })
    @PostMapping("/logout")
    public ResponseEntity<String> logout(Authentication authentication) {
        return ResponseEntity.ok("로그아웃 성공!");
    }
}