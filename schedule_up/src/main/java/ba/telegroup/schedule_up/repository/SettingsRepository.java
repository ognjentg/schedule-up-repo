package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SettingsRepository extends JpaRepository<Settings,Integer>  {
    List<Settings> getAllByCompanyId(Integer id);
    List<Settings> getAllByReminderTimeAfter(java.sql.Time time);
    List<Settings> getAllByReminderTimeBefore(java.sql.Time time);
    List<Settings> getAllByReminderTimeBetween(java.sql.Time from, java.sql.Time to);
    List<Settings> getAllByCancelTimeAfter(java.sql.Time time);
    List<Settings> getAllByCancelTimeBefore(java.sql.Time time);
    List<Settings> getAllByCancelTimeBetween(java.sql.Time from, java.sql.Time to);
}
