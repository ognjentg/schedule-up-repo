package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.repository.repositoryCustom.CompanyRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class CompanyRepositoryImpl implements CompanyRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT c.id, c.name, u.email FROM company c JOIN user u ON c.id=u.company_id";
    private static final String SQL_GET_ALL_EXTENDED_BY_ID = "SELECT c.id, c.name, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE c.id=?";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List getAllExtended() {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "CompanyUserMapping").getResultList();
    }

    @Override
    public List getAllExtendedById(Integer id) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_ID, "CompanyUserMapping").setParameter(1, id).getResultList();
    }
}
