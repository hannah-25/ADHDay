package hannah.mind.ADHDay.domain.medication.dto;

import hannah.mind.ADHDay.domain.medication.Medication;
import hannah.mind.ADHDay.domain.medication.MedicationType;
import lombok.Builder;
import lombok.Getter;

import java.util.Arrays;
import java.util.List;

@Getter
@Builder
public class MedicationResponse {
    
    private Long id;
    private String name;
    private String activeIngredient;
    private MedicationType type;
    private String mechanism;
    private String benefits;
    private String commonSideEffects;
    private List<String> availableDosages;
    
    public static MedicationResponse from(Medication medication) {
        List<String> dosages = medication.getAvailableDosages() != null 
            ? Arrays.asList(medication.getAvailableDosages().split(",\\s*"))
            : List.of();
            
        return MedicationResponse.builder()
                .id(medication.getId())
                .name(medication.getName())
                .activeIngredient(medication.getActiveIngredient())
                .type(medication.getType())
                .mechanism(medication.getMechanism())
                .benefits(medication.getBenefits())
                .commonSideEffects(medication.getCommonSideEffects())
                .availableDosages(dosages)
                .build();
    }
}
