package hannah.mind.ADHDay.auth.jwt.filter;

import hannah.mind.ADHDay.auth.jwt.JwtTokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
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

@Configuration
@RequiredArgsConstructor
public class JwtHeaderAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws
            ServletException, IOException {

        String path = request.getRequestURI();
        if (path.startsWith("/h2-console")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Authorization 헤더에서 토큰 추출
        String accessToken = getTokenFromHeader(request);
        System.out.println("Authorization 헤더: " + accessToken);

        // 가져온 토큰이 유효한지 확인하고, 유효한 때는 인증 정보 설정
        if (accessToken != null && jwtTokenProvider.validateToken(accessToken)) {
            Authentication authentication = jwtTokenProvider.getAuthentication(accessToken);
            System.out.println("인증된 Authentication: " + authentication);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            System.out.println("토큰이 없거나 유효하지 않음");
        }
        filterChain.doFilter(request, response);
    }

    private String getTokenFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}