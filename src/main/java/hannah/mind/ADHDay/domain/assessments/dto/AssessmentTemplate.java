package hannah.mind.ADHDay.domain.assessments.dto;

import lombok.Data;

import java.util.List;

// JSON 구조 그대로 매핑하는 DTO
@Data
public class AssessmentTemplate {

    private Long typeId;
    private String typeName;
    private String description;
    private List<Question> questions;

    @Data
    public static class Question {
        private Long id;
        private Integer orderNumber;
        private String text;

        // ✅ 반드시 있어야 함! (각 질문에 옵션)
        private List<ScoreOption> options;
    }

    @Data
    public static class ScoreOption {
        private Integer value;
        private String label;
    }

}