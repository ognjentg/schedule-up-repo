package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.UserGroupHasUser;
import ba.telegroup.schedule_up.model.UserGroupHasUserPK;
import ba.telegroup.schedule_up.repository.repositoryCustom.UserGroupHasUserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserGroupHasUserRepository extends JpaRepository<UserGroupHasUser, UserGroupHasUserPK>, UserGroupHasUserRepositoryCustom {

}
