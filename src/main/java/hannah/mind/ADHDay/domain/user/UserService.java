package hannah.mind.ADHDay.domain.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    public User findByEmail(String email){

        try {
            return userRepository.findByEmail(email);
        }catch (Exception e){
            throw new IllegalArgumentException("User not found");
        }
    }
}
