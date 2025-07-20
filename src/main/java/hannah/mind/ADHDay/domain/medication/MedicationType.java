package hannah.mind.ADHDay.domain.medication;

public enum MedicationType {
    STIMULANT("자극제"),
    NON_STIMULANT("비자극제");

    private final String description;

    MedicationType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
