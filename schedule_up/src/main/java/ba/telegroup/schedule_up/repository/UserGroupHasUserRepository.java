package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.UserGroupHasUser;
import ba.telegroup.schedule_up.model.UserGroupHasUserPK;
import ba.telegroup.schedule_up.repository.repositoryCustom.UserGroupHasUserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface UserGroupHasUserRepository extends JpaRepository<UserGroupHasUser, UserGroupHasUserPK>, UserGroupHasUserRepositoryCustom {

    List<UserGroupHasUser> getDistinctBy();
    @Query(value ="SELECT user_id from user_group_has_user  where user_group_id=?1",nativeQuery = true)
    List<Integer> getUserIdsByGroupId(Integer groupId);
}
