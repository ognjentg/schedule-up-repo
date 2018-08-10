package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;

public interface ParticipantRepository extends JpaRepository<Participant,Integer> {
     List<Participant> getAllByCompanyIdAndDeletedIs(Integer companyId,byte deleted);
     List<Participant> getAllByMeetingIdAndDeletedIs(Integer meetingId,byte deleted);
     List<Participant> getAllByUserGroupIdAndDeletedIs(Integer userId,byte deleted);
     List<Participant> getAllByUserIdAndDeletedIs(Integer userId,byte deleted);
     List<Participant> getAllByEmailAndDeletedIs(String email,byte deleted);

     @Query(value ="SELECT DISTINCT email FROM participant  WHERE meeting_id=?1 AND email IS NOT NULL",nativeQuery = true)
     List<String> getParticipantOther(Integer meetingId);
}
