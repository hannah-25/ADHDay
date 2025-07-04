package hannah.mind.ADHDay.user.auth;

import hannah.mind.ADHDay.user.User;
import hannah.mind.ADHDay.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;


//스프링 시큐리티에서 사용자 정보를 가져오는 인터페이스
@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    //사용자 이름(email)로 사용자의 정보를 가져오는 메서드
    @Override
    public CustomUserDetails loadUserByUsername(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Collection<SimpleGrantedAuthority> authorites =
                user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName()))
                        .collect(Collectors.toSet());

        return new CustomUserDetails(user, authorites);
    }

}
