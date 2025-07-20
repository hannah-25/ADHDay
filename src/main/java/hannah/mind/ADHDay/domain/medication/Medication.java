package hannah.mind.ADHDay.domain.medication;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 약물 기본 정보 (콘서타, 메틸페니데이트, 아토목세틴 등)
 */
@Entity
@Table(name = "medications")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 약물명 (ex. 콘서타, 메틸페니데이트)

    @Column(nullable = false)
    private String activeIngredient; // 주성분 (ex. methylphenidate)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicationType type; // 약물 타입 (STIMULANT, NON_STIMULANT)

    @Column(columnDefinition = "TEXT")
    private String mechanism; // 약물 기전 설명

    @Column(columnDefinition = "TEXT")
    private String benefits; // 효과/장점

    @Column(columnDefinition = "TEXT")
    private String commonSideEffects; // 일반적 부작용

    @Column(columnDefinition = "TEXT")
    private String availableDosages; // 사용 가능한 용량들 (ex. "18mg, 27mg, 36mg, 54mg")

    @Builder
    public Medication(String name, String activeIngredient, MedicationType type, 
                     String mechanism, String benefits, String commonSideEffects, 
                     String availableDosages) {
        this.name = name;
        this.activeIngredient = activeIngredient;
        this.type = type;
        this.mechanism = mechanism;
        this.benefits = benefits;
        this.commonSideEffects = commonSideEffects;
        this.availableDosages = availableDosages;
    }
}
