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
    private static final String SQL_GET_ADMIN_EMAIL_BY_COMPANY_ID = "SELECT u.email FROM company c JOIN user u ON c.id=u.company_id WHERE c.deleted=0 AND u.deleted=0 AND u.role_id=2 AND c.id=?";
    private static final String SQL_GET_ADMIN_ID_BY_MAIL = "SELECT id FROM user WHERE email=?";
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


    @Override
    @Transactional
    public CompanyUser insertExtended(CompanyUser companyUser) {

        EntityManager entityManager1 = emf.createEntityManager();
        EntityTransaction transaction = entityManager1.getTransaction();
        transaction.begin();

        Company company = new Company();
        company.setId(null);
        company.setName(companyUser.getName());
        company.setTimeTo(companyUser.getTimeTo());
        company.setTimeFrom(companyUser.getTimeFrom());
        company.setDeleted((byte) 0);

        entityManager1.persist(company);
        companyUser.setId(company.getId());

        User user = new User();
        user.setActive((byte)0);
        user.setUsername(null);
        user.setCompanyId(company.getId());
        user.setDeactivationReason(null);
        user.setDeleted((byte) 0);
        user.setEmail(companyUser.getEmail());
        user.setFirstName(null);
        user.setLastName(null);
        user.setPassword(null);
        user.setId(null);
        user.setPhoto(null);
        user.setPin(null);
        user.setRoleId(2);
        entityManager1.persist(user);

        transaction.commit();
        entityManager1.close();

        return companyUser;
    }

    @Override
    @Transactional
    public CompanyUser updateExtended(Integer companyId, CompanyUser companyUser) {

            EntityManager entityManager1 = emf.createEntityManager();
            EntityTransaction transaction = entityManager1.getTransaction();
            transaction.begin();

            Company company = entityManager1.find(Company.class, companyId);
            String mail= (String)entityManager.createNativeQuery(SQL_GET_ADMIN_EMAIL_BY_COMPANY_ID).setParameter(1, companyId).getResultList().get(0);
            if(mail != null && !companyUser.getEmail().equals(mail)){
                Integer userId = (Integer) entityManager.createNativeQuery(SQL_GET_ADMIN_ID_BY_MAIL).setParameter(1, mail).getResultList().get(0);
                User userTemp = entityManager1.find(User.class, userId);

                userTemp.setActive((byte) 0);
                entityManager1.persist(userTemp);

                User newUser = new User();
                newUser.setId(null);
                newUser.setActive((byte) 0);
                newUser.setCompanyId(companyUser.getId());
                newUser.setDeactivationReason(null);
                newUser.setDeleted((byte) 0);
                newUser.setEmail(companyUser.getEmail());
                newUser.setFirstName(null);
                newUser.setLastName(null);
                newUser.setPassword(null);
                newUser.setId(null);
                newUser.setPhoto(null);
                newUser.setPin(null);
                newUser.setRoleId(2);
                entityManager1.persist(newUser);
            }

            company.setName(companyUser.getName());
            company.setTimeFrom(companyUser.getTimeFrom());
            company.setTimeTo(companyUser.getTimeTo());
            transaction.commit();
            entityManager1.close();

            return companyUser;
    }


}