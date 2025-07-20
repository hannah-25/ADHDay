package hannah.mind.ADHDay.domain.medication;

public enum MedicationStatus {
    ACTIVE("복용 중"),
    PAUSED("일시 중단"),
    DISCONTINUED("중단");

    private final String description;

    MedicationStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
