package hannah.mind.ADHDay.domain.account;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//스프링 시큐리티에서 사용자 정보를 가져오는 인터페이스
@RequiredArgsConstructor
@Service
public class AccountDetailsService implements UserDetailsService {

    private final AccountRepository accountRepository;

    // 인증할 때 "아이디(주로 username/email)"를 기준으로 DB에서 사용자 정보 가져오기" 용도
    // 로그인 시 호출되는 진입점이자 DB → UserDetails 객체로 매핑 하는 자리
    // 반드시 userdetails를 구현한 객체를 반환해야 함
    @Override
    public Account loadUserByUsername(String email){
        return accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

}
