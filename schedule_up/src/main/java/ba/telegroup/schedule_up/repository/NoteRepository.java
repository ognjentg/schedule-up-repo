package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Timestamp;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Integer> {

    List<Note> getAllByCompanyIdAndDeletedEquals(Integer id, Byte deleted);
    List<Note> getAllByCompanyIdAndUserIdAndDeletedEquals(Integer companyId, Integer userId,Byte deleted);
    List<Note> getAllByCompanyIdAndNameContainsIgnoreCaseAndDeletedEquals(Integer companyId,String name,Byte deleted);
//    List<Note> getAllByPublishTimeAfter(Timestamp time);
//    List<Note> getAllByPublishTimeBefore(Timestamp time);

}
