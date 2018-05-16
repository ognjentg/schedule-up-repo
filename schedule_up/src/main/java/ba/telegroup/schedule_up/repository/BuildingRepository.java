package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingRepository extends JpaRepository<Building, Integer> {
}
