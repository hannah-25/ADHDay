package hannah.mind.ADHDay.domain.medication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class UserMedicationRequest {
    
    @NotNull(message = "약물 ID는 필수입니다.")
    private Long medicationId;
    
    @NotBlank(message = "복용 용량은 필수입니다.")
    private String dosage;
    
    private String notes;
    
    private List<ScheduleRequest> schedules;
    
    @Getter
    @NoArgsConstructor
    public static class ScheduleRequest {
        @NotNull(message = "복용 시간은 필수입니다.")
        private LocalTime scheduledTime;
        
        private String description;
    }
}
