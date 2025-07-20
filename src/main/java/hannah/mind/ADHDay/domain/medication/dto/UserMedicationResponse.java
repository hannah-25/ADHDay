package hannah.mind.ADHDay.domain.medication.dto;

import hannah.mind.ADHDay.domain.medication.MedicationStatus;
import hannah.mind.ADHDay.domain.medication.UserMedication;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class UserMedicationResponse {
    
    private Long id;
    private MedicationResponse medication;
    private String dosage;
    private MedicationStatus status;
    private String notes;
    private List<ScheduleResponse> schedules;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Getter
    @Builder
    public static class ScheduleResponse {
        private Long id;
        private LocalTime scheduledTime;
        private String description;
        private Boolean isActive;
    }
    
    public static UserMedicationResponse from(UserMedication userMedication) {
        List<ScheduleResponse> schedules = userMedication.getSchedules().stream()
                .map(schedule -> ScheduleResponse.builder()
                        .id(schedule.getId())
                        .scheduledTime(schedule.getScheduledTime())
                        .description(schedule.getDescription())
                        .isActive(schedule.getIsActive())
                        .build())
                .collect(Collectors.toList());
        
        return UserMedicationResponse.builder()
                .id(userMedication.getId())
                .medication(MedicationResponse.from(userMedication.getMedication()))
                .dosage(userMedication.getDosage())
                .status(userMedication.getStatus())
                .notes(userMedication.getNotes())
                .schedules(schedules)
                .createdAt(userMedication.getCreatedAt())
                .updatedAt(userMedication.getUpdatedAt())
                .build();
    }
}
