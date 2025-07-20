package hannah.mind.ADHDay.domain.medication;

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

/**
 * 약물 복용 시간 스케줄
 */
@Entity
@Table(name = "medication_schedules")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class MedicationSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_medication_id", nullable = false)
    private UserMedication userMedication;

    @Column(nullable = false)
    private LocalTime scheduledTime; // 복용 예정 시간

    private String description; // 스케줄 설명 (ex. "아침 식후", "점심")

    @Column(nullable = false)
    private Boolean isActive; // 활성화 여부

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Builder
    public MedicationSchedule(UserMedication userMedication, LocalTime scheduledTime, 
                             String description, Boolean isActive) {
        this.userMedication = userMedication;
        this.scheduledTime = scheduledTime;
        this.description = description;
        this.isActive = isActive != null ? isActive : true;
    }

    public void updateScheduledTime(LocalTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public void updateDescription(String description) {
        this.description = description;
    }

    public void toggleActive() {
        this.isActive = !this.isActive;
    }
}
