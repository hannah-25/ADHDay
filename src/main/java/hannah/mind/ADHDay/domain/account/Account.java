package hannah.mind.ADHDay.domain.account;

import hannah.mind.ADHDay.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;


//Spring Security의 UserDetails 인터페이스를 구현하여 인증 정보를 제공하는 엔티티 클래스

@Table(name = "account")
@Getter
@Entity
@NoArgsConstructor
public class Account implements UserDetails {

    @Id // 기본키 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 전략 사용
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<AccountType> accountTypes = new HashSet<>();


    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    private User user;

    @Builder
    public Account(String email, String password) {
        this.email = email;
        this.password = password;
        this.accountTypes = Collections.singleton(AccountType.ROLE_USER);
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return accountTypes.stream()
                .map(type -> new SimpleGrantedAuthority(type.name()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return email;
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

