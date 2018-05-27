package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.Company;
import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;
import ba.telegroup.schedule_up.repository.repositoryCustom.CompanyRepositoryCustom;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.util.List;

public class CompanyRepositoryImpl implements CompanyRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT c.id, c.name,c.time_from,c.time_to, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE c.deleted=0 AND u.deleted=0";
    private static final String SQL_GET_ALL_EXTENDED_BY_ID = "SELECT c.id, c.name,c.time_from,c.time_to, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE c.id=? AND c.deleted=0 AND u.deleted=0";
    private static final String SQL_GET_ALL_EXTENDED_BY_NAME = "SELECT c.id, c.name,c.time_from,c.time_to, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE INSTR(c.name, ?) > 0 AND c.deleted=0 AND u.deleted=0";
    private static final String SQL_GET_ALL_EXTENDED_BY_ID_EMAIL = "SELECT c.id, c.name,c.time_from,c.time_to, u.email FROM company c JOIN user u ON c.id=? WHERE u.email=? AND c.deleted=0 AND u.deleted=0";
    private static final String SQL_UPDATE_EXTENDED = "UPDATE company JOIN user on company.id=user.company_id SET company.name=?, company.time_from=?, company.time_to=?, user.email=? user.deleted=? WHERE user.company_id=? AND user.email=?";
    private static final String SQL_DELETE_COMPANY = "UPDATE company JOIN user on company.id=user.company_id SET company.deleted=1, user.active=0 WHERE company.id=?";


    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<CompanyUser> getAllExtended() {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "CompanyUserMapping").getResultList();
    }

    @Override
    public List getAllExtendedById(Integer id) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_ID, "CompanyUserMapping").setParameter(1, id).getResultList();
    }

    @Override
    public List getAllExtendedByNameContains(String name) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_NAME, "CompanyUserMapping").setParameter(1, name).getResultList();
    }

    @Override
    public CompanyUser getByIdAndEmail(Integer id, String email) {
        try {
            CompanyUser companyUser = (CompanyUser) entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_ID_EMAIL, "CompanyUserMapping").setParameter(1, id).setParameter(2, email).getSingleResult();
            return companyUser;
        } catch(NoResultException ex) {
            return null;
        }
    }

    @Override
    @Transactional
    public String updateExtended(Integer id, String email, CompanyUser companyUser) {
        try {
            Boolean active = true;
            if (!email.equals(companyUser.getEmail())) {        // ukoliko su im razliciti mejlovi, stavi da je active 0
                active = false;
            }
            entityManager.createNativeQuery(SQL_UPDATE_EXTENDED)
                    .setParameter(1, companyUser.getName())
                    .setParameter(2, companyUser.getTimeFrom())
                    .setParameter(3, companyUser.getTimeTo())
                    .setParameter(4, companyUser.getEmail())
                    .setParameter(5, active)
                    .setParameter(6, id)
                    .setParameter(7, email)
                    .executeUpdate();
            return "Success";
        } catch(Exception ex) {
            ex.printStackTrace();
            return "";
        }
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
            return "";
        }
    }


}