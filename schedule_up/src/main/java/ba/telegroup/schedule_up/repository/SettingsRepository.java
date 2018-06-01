package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SettingsRepository extends JpaRepository<Settings,Integer>  {
    List<Settings> getAllByCompanyId(Integer companyId);
    List<Settings> getAllByReminderTimeAfterAndCompanyId(java.sql.Time time, Integer companyId);
    List<Settings> getAllByReminderTimeBeforeAndCompanyId(java.sql.Time time, Integer companyId);
    List<Settings> getAllByReminderTimeBetweenAndCompanyId(java.sql.Time from, java.sql.Time to, Integer companyId);
    List<Settings> getAllByCancelTimeAfterAndCompanyId(java.sql.Time time, Integer companyId);
    List<Settings> getAllByCancelTimeBeforeAndCompanyId(java.sql.Time time, Integer companyId);
    List<Settings> getAllByCancelTimeBetweenAndCompanyId(java.sql.Time from, java.sql.Time to, Integer companyId);
}
