package hannah.mind.ADHDay.auth.jwt.filter;

import hannah.mind.ADHDay.auth.jwt.TokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


// `OncePerRequestFilter`를 상속받아 요청당 한 번만 실행되도록 보장
@Configuration
@RequiredArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final TokenProvider tokenProvider;
    private final static String HEADER_AUTHORIZATION = "Authorization";

    // JWT 토큰은 일반적으로 "Bearer " 접두사와 함께 전송
    private final static String TOKEN_PREFIX = "Bearer ";


    // doFilterInternal : OncePerRequestFilter가 제공하는 추상 메서드
    // 요청헤더 authorization에서 jwt 추출 -> jwt 토큰 유효성 확인 후 인증객체 생성& 저장 -> 다음 필터로 전달
    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws
            ServletException, IOException {

        String path = request.getRequestURI();
        if (path.startsWith("/h2-console")) {
            filterChain.doFilter(request, response);
            return;
        }


        // 요청 헤더의 Authorization 키의 값 조회
        // request.getHeader("hannah") → 요청 헤더에 hannah: 12345 있으면 "12345" 반환, 없으면 null.
        // 여러 값이면 request.getHeaders("헤더명")로 Enumeration 받아서 순회 가능!
        String authorizationHeader = request.getHeader(HEADER_AUTHORIZATION);

        // 가져온 값에서 접두사(Token_prefix(bearer)) 제거
        String token = getAccessToken(authorizationHeader);

        // 가져온 토큰이 유효한지 확인하고, 유효한 때는 인증 정보 설정
        if(tokenProvider.validateToken(token)){
            Authentication authentication = tokenProvider.getAuthentication(token);

            // SecurityContextHolder에 인증 객체 (UsernamePasswordAuthenticationToken) 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }


        // filterChain.doFilter()로 다음 필터로 전달
        filterChain.doFilter(request, response);
    }


    // authorization 헤더 전달 받음 => prefix 지우고 jwt만 추출
    private String getAccessToken(String authorizationHeader){
        if(authorizationHeader == null || !authorizationHeader.startsWith(TOKEN_PREFIX)){
            return null;
        }
        return authorizationHeader.replace(TOKEN_PREFIX, "");
    }

}
