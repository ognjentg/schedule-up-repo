package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting,Integer>{
    List<Meeting> getAllByStatusInAndCompanyId(Byte[] status,Integer companyId);
    @Query(value = "SELECT distinct r.id, r.topic, r.start_time,r.end_time,r.participants_number,r.status,r.description, r.cancelation_reason, " +
            "r.room_id,r.user_id,r.company_id FROM meeting r JOIN Participant p ON r.id=p.meeting_id LEFT JOIN user_group_has_user u on p.user_group_id=u.user_group_id WHERE (r.status=0 or r.status=1) and p.deleted=0 " +
            "and (p.user_id=?1 or u.user_id=?1)",nativeQuery = true)
    List<Meeting> getAllByUserId(Integer userId);
    @Query(value ="SELECT id from meeting  where room_id=?3 AND (start_time BETWEEN ?1 AND ?2 OR end_time BETWEEN ?1 AND ?2 OR(start_time<?1 AND end_time>?2)) and (status=0 or status=1)",nativeQuery = true)
    List<Integer> getIdsOfMeetingsBetween(Timestamp start,Timestamp end,Integer roomId);
    @Query(value = "SELECT r.id, r.topic, r.start_time,r.end_time,r.participants_number,r.status,r.description, r.cancelation_reason, " +
            "r.room_id,r.user_id,r.company_id FROM meeting r  WHERE (r.status=0 or r.status=1) " +
            "and r.company_id=?2 and r.room_id=?1",nativeQuery = true)
    List<Meeting> getAllByRoomIdAndCompanyId(Integer roomId,Integer companyId);
    @Query(value ="SELECT meeting.participants_number from meeting  where meeting.id=?1",nativeQuery = true)
    Integer getParticipantsNumberByMeetingId(Integer meetingId);
    @Query(value ="(SELECT distinct t.email as type FROM  participant p  left join user_group_has_user u on p.user_group_id=u.user_group_id left join user t on t.id=u.user_id or p.user_id=t.id " +
            "where p.deleted=0 and p.meeting_id=?1 and  t.id is not null) union (select distinct email from participant where email is not null and meeting_id=?1 and deleted=0);",nativeQuery = true)
    List<String> getEmailsForMeeting(Integer meetingId);


}
