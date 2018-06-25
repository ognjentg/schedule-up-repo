package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Integer> {

    List<Document> getAllByIdIsAfter(Integer id);
    List<Document> getAllByIdIsBefore(Integer id);
    List<Document> getAllByNameContains(String name);
    List<Document> getAllByMeetingId(Integer meetingId);
}
