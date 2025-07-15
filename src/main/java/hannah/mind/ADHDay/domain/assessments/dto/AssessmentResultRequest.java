package hannah.mind.ADHDay.domain.assessments.dto;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
@Getter
public class AssessmentResultRequest {
    private List<Answer> answers;

    @Data
    public static class Answer {
        private Integer questionId;
        private Integer score;
    }
}
