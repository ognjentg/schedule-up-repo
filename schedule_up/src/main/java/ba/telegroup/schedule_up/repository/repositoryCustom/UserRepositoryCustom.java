package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.User;

import java.util.List;

public interface UserRepositoryCustom {

    List<User> getNonInGroupByCompanyId(Integer companyId);
}
