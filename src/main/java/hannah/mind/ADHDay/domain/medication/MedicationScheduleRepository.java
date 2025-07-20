package hannah.mind.ADHDay.domain.medication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface MedicationScheduleRepository extends JpaRepository<MedicationSchedule, Long> {
    
    List<MedicationSchedule> findByUserMedicationAndIsActiveOrderByScheduledTime(UserMedication userMedication, Boolean isActive);
    
    @Query("SELECT ms FROM MedicationSchedule ms " +
           "JOIN ms.userMedication um " +
           "WHERE um.user.id = :userId " +
           "AND um.status = 'ACTIVE' " +
           "AND ms.isActive = true " +
           "ORDER BY ms.scheduledTime")
    List<MedicationSchedule> findActiveSchedulesByUserId(@Param("userId") Long userId);
    
    @Query("SELECT ms FROM MedicationSchedule ms " +
           "JOIN ms.userMedication um " +
           "WHERE um.user.id = :userId " +
           "AND um.status = 'ACTIVE' " +
           "AND ms.isActive = true " +
           "AND ms.scheduledTime BETWEEN :startTime AND :endTime " +
           "ORDER BY ms.scheduledTime")
    List<MedicationSchedule> findActiveSchedulesByUserIdAndTimeRange(@Param("userId") Long userId,
                                                                    @Param("startTime") LocalTime startTime,
                                                                    @Param("endTime") LocalTime endTime);
}
