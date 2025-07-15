package hannah.mind.ADHDay.domain.assessments;

import hannah.mind.ADHDay.domain.assessments.entity.UserAssessmentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAssessmentAnswerRepository extends JpaRepository<UserAssessmentAnswer, Long> {
}
