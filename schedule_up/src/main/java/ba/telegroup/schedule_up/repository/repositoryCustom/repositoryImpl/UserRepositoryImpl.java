package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.repository.repositoryCustom.UserRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class UserRepositoryImpl implements UserRepositoryCustom {

    private static final String SQL_SELECT_COMPANY_NAME_BY_COMPANY_ID = "SELECT name FROM company WHERE id=? AND deleted=false";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public String getCompanyNameByCompanyId(Integer companyId) {
        List<String> companyName = (List<String>) entityManager.createNativeQuery(SQL_SELECT_COMPANY_NAME_BY_COMPANY_ID).setParameter(1, companyId).getResultList();
        if(companyName != null && !companyName.isEmpty()){
            return companyName.get(0);
        }
        else{
            return null;
        }
    }
}
