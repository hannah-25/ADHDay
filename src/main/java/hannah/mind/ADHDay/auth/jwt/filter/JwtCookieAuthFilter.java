package hannah.mind.ADHDay.auth.jwt.filter;

import hannah.mind.ADHDay.auth.jwt.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


// `OncePerRequestFilter`를 상속받아 요청당 한 번만 실행되도록 보장
//@Configuration
@RequiredArgsConstructor
public class JwtCookieAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

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


        // 쿠키에서 토큰 꺼냄
        String accessToken = getTokenFromCookie(request, "access_token");

        // 가져온 토큰이 유효한지 확인하고, 유효한 때는 인증 정보 설정
        if (accessToken != null && jwtTokenProvider.validateToken(accessToken)) {
            Authentication authentication = jwtTokenProvider.getAuthentication(accessToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }


        // filterChain.doFilter()로 다음 필터로 전달
        filterChain.doFilter(request, response);
    }


    private String getTokenFromCookie(HttpServletRequest request, String cookieName) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

}
