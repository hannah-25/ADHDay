package hannah.mind.ADHDay.domain.assessments;


import hannah.mind.ADHDay.domain.assessments.dto.AssessmentResultRequest;
import hannah.mind.ADHDay.domain.assessments.entity.AssessmentType;
import hannah.mind.ADHDay.domain.assessments.entity.UserAssessment;
import hannah.mind.ADHDay.domain.assessments.entity.UserAssessmentAnswer;
import hannah.mind.ADHDay.domain.user.User;
import hannah.mind.ADHDay.domain.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserAssessmentService {

    private final UserService userService;
    private final UserAssessmentRepository userAssessmentRepository;

    public void saveAssessment(String email, Integer typeId, AssessmentResultRequest request) {
        User user = userService.findByEmail(email);
        AssessmentType type = AssessmentType.fromId(typeId); // ENUM 변환 예시
        UserAssessment userAssessment = new UserAssessment(user, type);

        List<UserAssessmentAnswer> answers = request.getAnswers().stream()
                .map(a -> new UserAssessmentAnswer(userAssessment, a.getQuestionId(), a.getScore()))
                .toList();

        userAssessment.setAnswers(answers);

        userAssessmentRepository.save(userAssessment); // cascade로 answers도 저장됨
    }
}