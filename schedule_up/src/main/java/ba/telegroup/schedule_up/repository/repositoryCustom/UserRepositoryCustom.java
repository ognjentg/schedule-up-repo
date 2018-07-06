package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.User;

import java.util.List;

public interface UserRepositoryCustom {

    List<User> getNotInGroupByCompanyId(Integer companyId);
    List<User> getNotInGroupByCompanyIdAndGroupId(Integer companyId, Integer groupId);
}
