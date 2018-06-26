package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.sql.Timestamp;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting,Integer>{
    List<Meeting> getAllByStatusAndCompanyId(Byte status,Integer companyId);
    @Query(value = "SELECT r.id, r.topic, r.start_time,r.end_time,r.participants_number,r.status,r.description, r.cancelation_reason, " +
            "r.room_id,r.user_id,r.company_id FROM meeting r JOIN Participant p ON r.id=p.meeting_id WHERE r.status=0 and p.deleted=0 " +
            "and p.user_id=?1",nativeQuery = true)
    List<Meeting> getAllByParticipant(Integer participantId);
    @Query(value ="SELECT id from meeting  where room_id=?3 AND (start_time BETWEEN ?1 AND ?2 OR end_time BETWEEN ?1 AND ?2 OR(start_time<?1 AND end_time>?2)) and status=0",nativeQuery = true)
    List<Integer> getIdsOfMeetingsBetween(Timestamp start,Timestamp end,Integer roomId);
    @Query(value = "SELECT r.id, r.topic, r.start_time,r.end_time,r.participants_number,r.status,r.description, r.cancelation_reason, " +
            "r.room_id,r.user_id,r.company_id FROM meeting r JOIN Participant p ON r.id=p.meeting_id WHERE r.status=0 and p.deleted=0 " +
            "and p.user_id=?1 and r.room_id=?2",nativeQuery = true)
    List<Meeting> getAllByParticipantAndRoomId(Integer participantId,Integer roomId);
    List<Meeting> getAllByStatusAndRoomIdAndCompanyId(Byte status,Integer roomId,Integer companyId);
}
