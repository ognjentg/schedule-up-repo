package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Integer> {
}
