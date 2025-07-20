package hannah.mind.ADHDay.domain.medication;

import hannah.mind.ADHDay.domain.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 사용자별 복용 약물 정보
 */
@Entity
@Table(name = "user_medications")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class UserMedication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    @Column(nullable = false)
    private String dosage; // 복용 용량 (ex. "18mg")

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicationStatus status; // ACTIVE, PAUSED, DISCONTINUED

    @OneToMany(mappedBy = "userMedication", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicationSchedule> schedules = new ArrayList<>();

    private String notes; // 사용자 메모

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Builder
    public UserMedication(User user, Medication medication, String dosage, 
                         MedicationStatus status, String notes) {
        this.user = user;
        this.medication = medication;
        this.dosage = dosage;
        this.status = status != null ? status : MedicationStatus.ACTIVE;
        this.notes = notes;
    }

    public void updateStatus(MedicationStatus status) {
        this.status = status;
    }

    public void updateDosage(String dosage) {
        this.dosage = dosage;
    }

    public void updateNotes(String notes) {
        this.notes = notes;
    }

    public void addSchedule(LocalTime time, String description) {
        MedicationSchedule schedule = MedicationSchedule.builder()
                .userMedication(this)
                .scheduledTime(time)
                .description(description)
                .isActive(true)
                .build();
        this.schedules.add(schedule);
    }
}
