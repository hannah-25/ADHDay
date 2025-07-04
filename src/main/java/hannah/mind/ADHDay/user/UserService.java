package hannah.mind.ADHDay.user;

import hannah.mind.ADHDay.user.auth.dto.AddUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public User registerUser(AddUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        
        return userRepository.save(User.builder()
                .email(request.getEmail())
                .password(bCryptPasswordEncoder.encode(request.getPassword()))
                .build());
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("Unexpected user"));
    }



    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("Unexpected user"));
    }
}