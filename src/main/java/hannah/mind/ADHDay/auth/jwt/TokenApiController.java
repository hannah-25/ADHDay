package hannah.mind.ADHDay.auth.jwt;

import hannah.mind.ADHDay.auth.jwt.dto.CreateAccessTokenRequest;
import hannah.mind.ADHDay.auth.jwt.dto.CreateAccessTokenResponse;
import hannah.mind.ADHDay.config.JwtProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RequiredArgsConstructor
@RestController
@Tag(name = "Token API", description = "JWT 토큰 관련 API")
public class TokenApiController {

    private final TokenService tokenService;
    private final JwtProperties jwtProperties;


    @Operation(summary = "액세스 토큰 갱신", description = "리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "토큰 갱신 성공"),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 리프레시 토큰"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("api/token/refresh")
    public ResponseEntity<CreateAccessTokenResponse> refreshAccessToken(
            @Parameter(description = "리프레시 토큰", required = true)
            @RequestBody CreateAccessTokenRequest request) {
        String newAccessToken = tokenService.createNewAccessToken(request.getRefreshToken());

        return ResponseEntity.ok(new CreateAccessTokenResponse(newAccessToken));
    }

}
