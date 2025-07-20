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

    /**
     * 사용자 평가 결과를 저장하는 메서드
     * @param typeId 평가 유형 ID (ASRS, GAD7, PHQ9 등)
     */
    public void saveAssessment(String email, Integer typeId, List<AssessmentResultRequest.Answer> dtoAnswers) {
        // 이메일로 사용자 정보 조회
        User user = userService.findByEmail(email);
        
        // ID로부터 평가 유형 ENUM 변환
        AssessmentType type = AssessmentType.fromId(typeId);
        
        // 사용자 평가 엔티티 생성
        UserAssessment userAssessment = new UserAssessment(user, type);

        // 요청 데이터에서 각 질문별 답변을 UserAssessmentAnswer 엔티티로 변환
        List<UserAssessmentAnswer> answers = dtoAnswers.stream()
                .map(a -> new UserAssessmentAnswer(userAssessment, a.getQuestionId(), a.getValue()))
                .toList();

        // 평가에 답변 리스트 설정
        userAssessment.setAnswers(answers);
        
        // 평가 결과 저장 (CascadeType으로 answers도 함께 저장됨)
        userAssessmentRepository.save(userAssessment);
    }
}