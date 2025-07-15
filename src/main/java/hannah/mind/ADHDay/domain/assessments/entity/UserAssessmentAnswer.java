package hannah.mind.ADHDay.domain.assessments.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
public class UserAssessmentAnswer {
    // 그 설문에 대한 개별 문항 점수

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 제출된 설문지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_assessment_id")
    private UserAssessment userAssessment;

    // 설문지 질문 번호 (고정 json)
    @Column(nullable = false)
    private Integer questionId;

    // 선택된 점수 (ex. 0~3)
    @Column(nullable = false)
    private Integer score;

    public UserAssessmentAnswer(UserAssessment userAssessment, Integer questionId, Integer score) {
        this.userAssessment = userAssessment;
        this.questionId = questionId;
        this.score = score;
    }

}