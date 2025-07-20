package hannah.mind.ADHDay.domain.assessments.dto;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
public class AssessmentResultRequest {
    private List<Answer> answers;
    private Integer typeId;

    @Getter
    public static class Answer {
        private Integer questionId;
        private Integer value;
    }
}
