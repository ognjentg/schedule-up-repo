package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.repository.repositoryCustom.UserRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class UserRepositoryImpl implements UserRepositoryCustom {

    private static final String SQL_GET_NON_IN_GROUP_BY_COMPANY_ID = "SELECT DISTINCT u.id, u.email, u.username, u.password, u.pin, u.first_name, u.last_name, u.photo, u.active, u.deleted, u.deactivation_reason, u.token, u.token_time, u.company_id, u.role_id FROM user u LEFT JOIN user_group_has_user ughu ON u.id=ughu.user_id WHERE ughu.user_group_id IS NULL AND u.company_id=?";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<User> getNonInGroupByCompanyId(Integer companyId) {
        return entityManager.createNativeQuery(SQL_GET_NON_IN_GROUP_BY_COMPANY_ID, "UserMapping").setParameter(1, companyId).getResultList();
    }
}
