package hannah.mind.ADHDay.user.auth;

import hannah.mind.ADHDay.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;
    private final Collection<? extends GrantedAuthority> authorities;
    /*
     * 사용자의 권한 목록을 반환
     * 현재는 모든 사용자에게 'USER' 권한을 부여
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    //사용자의 식별자로 이메일을 사용
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    //계정 만료 여부
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //계정 잠금 여부
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //비밀번호 만료 여부
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //계정 활성화 여부
    @Override
    public boolean isEnabled() {
        return true;
    }

}
