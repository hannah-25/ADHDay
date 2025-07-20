package hannah.mind.ADHDay.domain.medication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    
    Optional<Medication> findByName(String name);
    
    List<Medication> findByType(MedicationType type);
    
    @Query("SELECT m FROM Medication m ORDER BY m.type, m.name")
    List<Medication> findAllOrderByTypeAndName();
}
