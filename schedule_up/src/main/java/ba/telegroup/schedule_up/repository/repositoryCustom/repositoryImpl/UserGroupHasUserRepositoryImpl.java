package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.repository.repositoryCustom.UserGroupHasUserRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class UserGroupHasUserRepositoryImpl implements UserGroupHasUserRepositoryCustom {

    private static final String SQL_GET_ALL_USER_BY_GROUP_ID = "SELECT u.id, u.email, u.username, u.password, u.pin, u.first_name, u.last_name, u.photo, u.active, u.deleted, u.deactivation_reason, u.token, u.token_time, u.company_id, u.role_id FROM user u JOIN user_group_has_user g ON g.user_id = u.id WHERE g.user_group_id = ? and u.deleted = 0";

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private EntityManagerFactory emf;

    @Override
    public List<User> getAllExtendedUsersByUserGroupId(Integer groupId) {
        return entityManager.createNativeQuery(SQL_GET_ALL_USER_BY_GROUP_ID, "UserMapping").setParameter(1, groupId).getResultList();
    }
}
