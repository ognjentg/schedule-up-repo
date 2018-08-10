package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.util.UserInformation;

import java.util.List;

public interface UserRepositoryCustom {

    User login(UserInformation userInformation);
    List<User> getNotInGroupByCompanyId(Integer companyId);
    List<User> getNotInGroupByCompanyIdAndGroupId(Integer companyId, Integer groupId);
    List<User> getByMeetingId(Integer meetingId);
}
