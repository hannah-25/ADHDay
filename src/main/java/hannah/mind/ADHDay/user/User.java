package hannah.mind.ADHDay.user;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;


//Spring Security의 UserDetails 인터페이스를 구현하여 인증 정보를 제공하는 엔티티 클래스

@Table(name = "users") // 데이터베이스 테이블 이름을 'users'로 지정
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 기본 생성자 접근 제한
@Getter
@Entity
public class User {

    @Id // 기본키 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 전략 사용
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();


    //사용자 객체 생성을 위한 빌더 메서드
    @Builder
    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }



}

