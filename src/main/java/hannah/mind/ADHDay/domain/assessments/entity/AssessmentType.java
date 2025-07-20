package hannah.mind.ADHDay.domain.assessments.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AssessmentType {

    ASRS(1, "ASRS"),
    GAD7(2, "GAD-7"),
    PHQ9(3, "PHQ-9");

    private final Integer id;
    private final String displayName;

    public static AssessmentType fromId(Integer id) {
        for (AssessmentType type : values()) {
            if (type.id.equals(id)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid AssessmentType id: " + id);
    }
}
