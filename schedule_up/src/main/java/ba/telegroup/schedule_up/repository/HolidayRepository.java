package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HolidayRepository extends JpaRepository<Holiday,Integer>{
}
