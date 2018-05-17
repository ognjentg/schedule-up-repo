package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Timestamp;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Integer> {

    List<Note> getAllByCompanyId(Integer id);
    List<Note> getAllByUserId(Integer id);
    List<Note> getAllByCompanyIdAndUserId(Integer companyId, Integer userId);
    List<Note> getAllByNameContains(String name);
//    List<Note> getAllByPublishTimeAfter(Timestamp time);
//    List<Note> getAllByPublishTimeBefore(Timestamp time);

}
