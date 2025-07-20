package hannah.mind.ADHDay.domain.medication;

import hannah.mind.ADHDay.domain.medication.dto.MedicationResponse;
import hannah.mind.ADHDay.domain.medication.dto.UserMedicationRequest;
import hannah.mind.ADHDay.domain.medication.dto.UserMedicationResponse;
import hannah.mind.ADHDay.domain.user.User;
import hannah.mind.ADHDay.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MedicationService {
    
    private final MedicationRepository medicationRepository;
    private final UserMedicationRepository userMedicationRepository;
    private final MedicationScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    
    /**
     * 모든 약물 목록 조회
     */
    public List<MedicationResponse> getAllMedications() {
        return medicationRepository.findAllOrderByTypeAndName()
                .stream()
                .map(MedicationResponse::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 약물 타입별 조회
     */
    public List<MedicationResponse> getMedicationsByType(MedicationType type) {
        return medicationRepository.findByType(type)
                .stream()
                .map(MedicationResponse::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 사용자 복용 약물 등록
     */
    @Transactional
    public UserMedicationResponse addUserMedication(Long userId, UserMedicationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        Medication medication = medicationRepository.findById(request.getMedicationId())
                .orElseThrow(() -> new IllegalArgumentException("약물을 찾을 수 없습니다."));
        
        // 이미 활성 상태로 같은 약물을 복용 중인지 확인
        if (userMedicationRepository.existsByUserAndMedicationAndStatus(user, medication, MedicationStatus.ACTIVE)) {
            throw new IllegalStateException("이미 복용 중인 약물입니다.");
        }
        
        UserMedication userMedication = UserMedication.builder()
                .user(user)
                .medication(medication)
                .dosage(request.getDosage())
                .status(MedicationStatus.ACTIVE)
                .notes(request.getNotes())
                .build();
        
        UserMedication savedUserMedication = userMedicationRepository.save(userMedication);
        
        // 스케줄 추가
        if (request.getSchedules() != null && !request.getSchedules().isEmpty()) {
            for (UserMedicationRequest.ScheduleRequest scheduleRequest : request.getSchedules()) {
                savedUserMedication.addSchedule(
                        scheduleRequest.getScheduledTime(),
                        scheduleRequest.getDescription()
                );
            }
            userMedicationRepository.save(savedUserMedication);
        }
        
        return UserMedicationResponse.from(savedUserMedication);
    }
    
    /**
     * 사용자 복용 약물 목록 조회
     */
    public List<UserMedicationResponse> getUserMedications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return userMedicationRepository.findByUserAndStatusWithDetails(user, MedicationStatus.ACTIVE)
                .stream()
                .map(UserMedicationResponse::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 사용자 복용 약물 상태 변경
     */
    @Transactional
    public UserMedicationResponse updateMedicationStatus(Long userId, Long userMedicationId, MedicationStatus status) {
        UserMedication userMedication = getUserMedicationByUserAndId(userId, userMedicationId);
        userMedication.updateStatus(status);
        
        return UserMedicationResponse.from(userMedication);
    }
    
    /**
     * 사용자 복용 약물 용량 변경
     */
    @Transactional
    public UserMedicationResponse updateMedicationDosage(Long userId, Long userMedicationId, String dosage) {
        UserMedication userMedication = getUserMedicationByUserAndId(userId, userMedicationId);
        userMedication.updateDosage(dosage);
        
        return UserMedicationResponse.from(userMedication);
    }
    
    /**
     * 복용 시간 스케줄 추가
     */
    @Transactional
    public UserMedicationResponse addMedicationSchedule(Long userId, Long userMedicationId, 
                                                       LocalTime scheduledTime, String description) {
        UserMedication userMedication = getUserMedicationByUserAndId(userId, userMedicationId);
        userMedication.addSchedule(scheduledTime, description);
        
        return UserMedicationResponse.from(userMedicationRepository.save(userMedication));
    }
    
    /**
     * 사용자의 오늘 복용 스케줄 조회
     */
    public List<MedicationSchedule> getTodaySchedules(Long userId) {
        return scheduleRepository.findActiveSchedulesByUserId(userId);
    }
    
    /**
     * 특정 시간대 복용 스케줄 조회
     */
    public List<MedicationSchedule> getSchedulesByTimeRange(Long userId, LocalTime startTime, LocalTime endTime) {
        return scheduleRepository.findActiveSchedulesByUserIdAndTimeRange(userId, startTime, endTime);
    }
    
    private UserMedication getUserMedicationByUserAndId(Long userId, Long userMedicationId) {
        UserMedication userMedication = userMedicationRepository.findById(userMedicationId)
                .orElseThrow(() -> new IllegalArgumentException("복용 약물 정보를 찾을 수 없습니다."));
        
        if (!userMedication.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 사용자의 약물이 아닙니다.");
        }
        
        return userMedication;
    }
}
