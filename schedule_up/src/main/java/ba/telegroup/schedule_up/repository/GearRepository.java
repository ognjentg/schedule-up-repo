package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Gear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GearRepository extends JpaRepository<Gear, Integer> {

    List<Gear> getAllByNameStartingWithIgnoreCase(String name);

}
