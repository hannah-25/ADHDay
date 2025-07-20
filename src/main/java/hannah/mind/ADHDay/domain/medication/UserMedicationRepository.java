package hannah.mind.ADHDay.domain.medication;

import hannah.mind.ADHDay.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserMedicationRepository extends JpaRepository<UserMedication, Long> {
    
    List<UserMedication> findByUserAndStatus(User user, MedicationStatus status);
    
    List<UserMedication> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT um FROM UserMedication um " +
           "JOIN FETCH um.medication " +
           "LEFT JOIN FETCH um.schedules s " +
           "WHERE um.user = :user AND um.status = :status " +
           "ORDER BY um.createdAt DESC")
    List<UserMedication> findByUserAndStatusWithDetails(@Param("user") User user, 
                                                        @Param("status") MedicationStatus status);
    
    Optional<UserMedication> findByUserAndMedicationAndStatus(User user, Medication medication, MedicationStatus status);
    
    boolean existsByUserAndMedicationAndStatus(User user, Medication medication, MedicationStatus status);
}
