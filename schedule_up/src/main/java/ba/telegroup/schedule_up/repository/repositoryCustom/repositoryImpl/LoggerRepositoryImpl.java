package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;
import ba.telegroup.schedule_up.model.modelCustom.LoggerUser;
import ba.telegroup.schedule_up.repository.repositoryCustom.LoggerRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class LoggerRepositoryImpl implements LoggerRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT l.id, l.action_type, l.action_details, l.table_name, l.created, l.user_id, l.atomic, l.company_id, u.username FROM logger l JOIN user u ON l.user_id=u.id";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<LoggerUser> getAllExtended() {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "LoggerUserMapping").getResultList();
    }

}
