package ba.telegroup.schedule_up.repository.repositoryCustom;

import java.util.List;

public interface UserGroupHasUserRepositoryCustom {

    List getAllExtendedUsersByUserGroupId(Integer groupId);
}
