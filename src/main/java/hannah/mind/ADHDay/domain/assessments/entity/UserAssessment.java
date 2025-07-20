package hannah.mind.ADHDay.domain.assessments.entity;

import hannah.mind.ADHDay.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAssessment {
    //유저의 개별 설문지 제출 기록
    // 필드 : 유저, 설문지 타입, 제출 일자

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 제출한 사용자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 설문지 종류 (ENUM으로 대체!)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssessmentType assessmentType;

    // 제출 일자
    private LocalDateTime submittedAt;

    // 개별 설문지의 답변 문항 모음
    @OneToMany(mappedBy = "userAssessment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserAssessmentAnswer> answers;


    // 첫페이지 : 증상 서술
    private String description;
    // 마지막 페이지 : 치료 기대 효과
    private String expectations;

    private LocalDateTime updatedAt;

    public UserAssessment(User user, AssessmentType assessmentType) {
        this.user = user;
        this.assessmentType = assessmentType;
        this.submittedAt = LocalDateTime.now();
    }
}