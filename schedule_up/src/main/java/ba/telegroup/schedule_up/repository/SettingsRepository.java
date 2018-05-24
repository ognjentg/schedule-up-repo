package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingsRepository extends JpaRepository<Settings,Integer>  {
}
