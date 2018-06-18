package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder,Integer> {

    List<Reminder> getAllByDeletedEquals(byte deleted);
}
