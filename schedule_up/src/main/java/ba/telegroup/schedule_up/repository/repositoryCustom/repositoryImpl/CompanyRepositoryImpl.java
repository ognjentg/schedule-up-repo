package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.Company;
import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;
import ba.telegroup.schedule_up.repository.UserRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.CompanyRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.sql.Time;
import java.util.List;

public class CompanyRepositoryImpl implements CompanyRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT c.id, c.name,c.time_from,c.time_to,c.company_logo, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE c.deleted=0 AND u.deleted=0 AND u.active=1 AND u.role_id=2";
    private static final String SQL_GET_ALL_EXTENDED_BY_ID = "SELECT c.id, c.name, c.time_from, c.time_to,c.company_logo, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE c.id=? AND c.deleted=0 AND u.deleted=0 AND u.active=1 AND u.role_id=2";
    private static final String SQL_GET_ALL_EXTENDED_BY_NAME = "SELECT c.id, c.name,c.time_from,c.time_to,c.company_logo, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE INSTR(c.name, ?) > 0 AND c.deleted=0 AND u.deleted=0";
    private static final String SQL_DELETE_COMPANY = "UPDATE company JOIN user on company.id=user.company_id SET company.deleted=1, user.active=0 WHERE company.id=?";

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private EntityManagerFactory emf;

    @Override
    public List<CompanyUser> getAllExtended() {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "CompanyUserMapping").getResultList();
    }

    @Override
    public CompanyUser getAllExtendedById(Integer userId) {
        try {
            return (CompanyUser) entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_ID, "CompanyUserMapping").setParameter(1, userId).getSingleResult();
        } catch(Exception ex) {
            return null;
        }
    }

    @Override
    public List getAllExtendedByNameContains(String name) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_NAME, "CompanyUserMapping").setParameter(1, name).getResultList();
    }


    @Override
    @Transactional
    public String deleteCompany(Company company) {
        try {
            entityManager.createNativeQuery(SQL_DELETE_COMPANY)
                    .setParameter(1, company.getId())
                    .executeUpdate();
            return "Success";
        } catch(Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}