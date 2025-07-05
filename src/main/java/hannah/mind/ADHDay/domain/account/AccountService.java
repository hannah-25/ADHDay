package hannah.mind.ADHDay.domain.account;

import hannah.mind.ADHDay.domain.account.dto.AuthRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public Account registerAccount(AuthRequest request) {
        if (accountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        
        return accountRepository.save(Account.builder()
                .email(request.getEmail())
                .password(bCryptPasswordEncoder.encode(request.getPassword()))
                .build());
    }

    public Account findById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("Unexpected user"));
    }



    public Account findByEmail(String email) {
        return accountRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("Unexpected user"));
    }
}