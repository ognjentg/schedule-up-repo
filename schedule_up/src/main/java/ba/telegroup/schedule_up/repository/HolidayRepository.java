package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HolidayRepository extends JpaRepository<Holiday,Integer>{
    List<Holiday> getAllByCompanyId(Integer id);
    List<Holiday> getAllByNameContains(String name);
    List<Holiday> getAllByDateAfter(java.sql.Date date);
    List<Holiday> getAllByDateBefore(java.sql.Date date);
    List<Holiday> getAllByDateBetween(java.sql.Date from, java.sql.Date to);
}
