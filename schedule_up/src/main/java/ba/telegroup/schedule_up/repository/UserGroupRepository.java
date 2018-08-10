package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserGroupRepository extends JpaRepository<UserGroup, Integer> {
    List<UserGroup> getAllByCompanyIdAndDeletedEquals(Integer companyId, Byte deleted);

    @Query(value ="SELECT ug.id, ug.name, ug.deleted, ug.company_id FROM user_group ug INNER JOIN participant p ON ug.id=p.user_group_id WHERE p.meeting_id=?1",nativeQuery = true)
    List<UserGroup> getParticipantsGroup(Integer meetingId);

}
