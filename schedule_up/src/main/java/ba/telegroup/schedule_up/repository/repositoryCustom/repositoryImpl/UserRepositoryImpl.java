package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.repository.repositoryCustom.UserRepositoryCustom;
import ba.telegroup.schedule_up.util.UserInformation;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class UserRepositoryImpl implements UserRepositoryCustom {

    private static final String SQL_LOGIN = "SELECT DISTINCT u.id, u.email, u.username, u.password, u.pin, u.first_name, u.last_name, u.photo, u.active, u.deleted, u.token, u.token_time, u.company_id, u.role_id FROM user u JOIN company c ON IF(u.role_id=1, true, u.company_id=c.id) WHERE u.username=? AND u.password=SHA2(?, 512) AND IF(u.role_id=1, u.company_id IS NULL, c.name=?)";
    private static final String SQL_GET_NOT_IN_GROUP_BY_COMPANY_ID = "SELECT DISTINCT u.id, u.email, u.username, u.password, u.pin, u.first_name, u.last_name, u.photo, u.active, u.deleted, u.token, u.token_time, u.company_id, u.role_id FROM user u LEFT JOIN user_group_has_user ughu ON u.id=ughu.user_id WHERE ughu.user_group_id IS NULL AND u.company_id=?";
    private static final String SQL_GET_NOT_IN_GROUP_BY_COMPANY_ID_AND_GROUP_ID = "SELECT DISTINCT u.id, u.email, u.username, u.password, u.pin, u.first_name, u.last_name, u.photo, u.active, u.deleted, u.token, u.token_time, u.company_id, u.role_id FROM user u LEFT JOIN user_group_has_user ughu ON u.id=ughu.user_id WHERE (ughu.user_group_id IS NULL OR u.id NOT IN (SELECT ughu2.user_id FROM user_group_has_user ughu2 WHERE ughu2.user_group_id=?)) AND u.company_id=?";
    private static final String SQL_GET_BY_MEETING_ID = "SELECT u.id, u.email, u.username, u.password, u.pin, u.first_name, u.last_name, u.photo, u.active, u.deleted, u.token, u.token_time, u.company_id, u.role_id FROM user u INNER JOIN participant p ON u.id=p.user_id WHERE p.meeting_id=?";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public User login(UserInformation userInformation) {
        List<User> user = entityManager.createNativeQuery(SQL_LOGIN, "UserMapping").setParameter(1, userInformation.getUsername()).setParameter(2, userInformation.getPassword()).setParameter(3, userInformation.getCompanyName()).getResultList();
        if(user == null || user.isEmpty()){
            return null;
        }
        else{
            return user.get(0);
        }
    }

    @Override
    public List<User> getNotInGroupByCompanyId(Integer companyId) {
        return entityManager.createNativeQuery(SQL_GET_NOT_IN_GROUP_BY_COMPANY_ID, "UserMapping").setParameter(1, companyId).getResultList();
    }

    @Override
    public List<User> getNotInGroupByCompanyIdAndGroupId(Integer companyId, Integer groupId) {
        return entityManager.createNativeQuery(SQL_GET_NOT_IN_GROUP_BY_COMPANY_ID_AND_GROUP_ID, "UserMapping").setParameter(1, groupId).setParameter(2, companyId).getResultList();
    }

    @Override
    public List<User> getByMeetingId(Integer meetingId) {
        return entityManager.createNativeQuery(SQL_GET_BY_MEETING_ID, "UserMapping").setParameter(1, meetingId).getResultList();

    }
}
