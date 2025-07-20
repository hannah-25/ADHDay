package hannah.mind.ADHDay.auth.security;

import hannah.mind.ADHDay.auth.jwt.filter.JwtHeaderAuthFilter;
import hannah.mind.ADHDay.domain.account.AccountDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import lombok.RequiredArgsConstructor;

/**
 * Spring Security 설정 클래스
 * JWT 기반 인증과 CORS 설정을 포함한 보안 구성을 담당
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtHeaderAuthFilter jwtHeaderAuthFilter;
    private final AccountDetailsService accountDetailsService;

    /**
     * Security Filter Chain 설정
     * HTTP 보안 구성, CORS, 세션 관리, 요청 인증 및 JWT 필터 설정을 담당
     *
     * @param http HttpSecurity 객체
     * @return SecurityFilterChain 빈
     * @throws Exception 보안 설정 중 발생할 수 있는 예외
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 보호 비활성화 (JWT 사용으로 인해)
                .csrf(csrf -> csrf.disable())
                // CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 세션 설정을 STATELESS로 변경 (JWT 기반 인증)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // HTTP 요청에 대한 인증 규칙 설정
                .authorizeHttpRequests(auth -> auth
                        // 정적 리소스는 인증 없이 접근 허용
                        .requestMatchers("/static/**", "/css/**", "/js/**", "/images/**").permitAll()
                        // 평가 템플릿 조회는 인증 없이 허용
                        .requestMatchers("/api/assessments/templates/**").permitAll()
                        // H2 콘솔 접근 허용 (개발용)
                        .requestMatchers("/h2-console/**").permitAll()
                        // 인증 관련 API는 인증 없이 접근 허용
                        .requestMatchers("/api/auth/login", "/api/auth/signup", "/api/auth/refresh").permitAll()
                        // Swagger 문서 접근 허용
                        .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui-custom.html").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()

                        .anyRequest().authenticated()
                )

                // JWT 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
                .addFilterBefore(jwtHeaderAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // H2 콘솔 사용을 위한 X-Frame-Options 설정
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                );

        return http.build();
    }


    /**
     * CORS 설정 구성
     * 프론트엔드(localhost:3000)와 백엔드(localhost:8080) 간 크로스 오리진 요청을 허용
     *
     * @return CorsConfigurationSource CORS 설정 소스
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 허용된 오리진 설정 (프론트엔드 주소)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        // 허용된 HTTP 메서드 설정
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // 모든 헤더 허용
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // 쿠키 및 인증 정보 포함 허용
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 경로에 CORS 설정 적용
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    /**
     * AuthenticationManager 빈 설정
     * 사용자 인증을 담당하는 매니저 구성
     *
     * @param http                  HttpSecurity 객체
     * @param bCryptPasswordEncoder 비밀번호 암호화 인코더
     * @return AuthenticationManager 인증 매니저
     * @throws Exception 인증 설정 중 발생할 수 있는 예외
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, BCryptPasswordEncoder bCryptPasswordEncoder) throws Exception {

        // DaoAuthenticationProvider: DB에서 사용자 정보를 불러와 비밀번호를 검사하는 제공자
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        // UserDetailsService 설정: DB에서 사용자를 찾고 UserDetails 반환
        authProvider.setUserDetailsService(accountDetailsService);

        // PasswordEncoder 설정: 입력한 비밀번호와 DB의 암호화된 비밀번호를 비교 (BCrypt)
        authProvider.setPasswordEncoder(bCryptPasswordEncoder);

        // ProviderManager: AuthenticationManager의 구현체로 인증 제공자들을 관리
        return new ProviderManager(authProvider);
    }

    /**
     * BCrypt 비밀번호 암호화 인코더 빈 등록
     *
     * @return BCryptPasswordEncoder 비밀번호 인코더 인스턴스
     */
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}