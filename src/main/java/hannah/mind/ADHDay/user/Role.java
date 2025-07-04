package hannah.mind.ADHDay.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Role {
    @Id
    @GeneratedValue
    private Long id;
    private String name; // 예: "ROLE_USER", "ROLE_ADMIN"
}
