package hannah.mind.ADHDay.config;

import hannah.mind.ADHDay.config.jwt.TokenAuthenticationFilter;
import hannah.mind.ADHDay.user.auth.CustomUserDetails;
import hannah.mind.ADHDay.user.auth.CustomUserDetailsService;
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

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final TokenAuthenticationFilter tokenAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 세션 설정을 STATELESS로 변경
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/static/**", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/api/auth/login", "/api/auth/signup").permitAll()
                .anyRequest().authenticated()
            )

            // JWT 필터 추가
            .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            .headers(headers -> headers
                    .frameOptions(frame -> frame.sameOrigin())
            );

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }



    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, BCryptPasswordEncoder bCryptPasswordEncoder) throws Exception{

        // DaoAuthenticationProvider = DB에서 사용자 정보 불러와 비밀번호 검사
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        // DB에서 User 찾고 UserDetails 반환
        authProvider.setUserDetailsService(userDetailsService);

        //입력한 비밀번호 vs DB 암호화 비밀번호 비교 (BCrypt)
        authProvider.setPasswordEncoder(bCryptPasswordEncoder);

        // ProviderManager는 AuthenticationManager의 구현체.
        return new ProviderManager(authProvider);
    }

    // 비밀번호 암호화를 위한 BCrypt 인코더 빈 등록 -> @return BCryptPasswordEncoder 인스턴스
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}