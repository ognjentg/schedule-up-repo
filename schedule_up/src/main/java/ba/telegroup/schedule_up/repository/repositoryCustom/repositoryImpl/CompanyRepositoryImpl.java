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

    private static final String SQL_GET_ALL_EXTENDED = "SELECT c.id, c.name,c.time_from,c.time_to, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE c.deleted=0 AND u.deleted=0";
    private static final String SQL_GET_ALL_EXTENDED_BY_ID = "SELECT c.id, c.name, c.time_from, c.time_to, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE u.id=? AND c.deleted=0 AND u.deleted=0";
    private static final String SQL_GET_ALL_EXTENDED_BY_NAME = "SELECT c.id, c.name,c.time_from,c.time_to, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE INSTR(c.name, ?) > 0 AND c.deleted=0 AND u.deleted=0";
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
        company.setId(companyUser.getId());
        company.setName(companyUser.getName());
        company.setTimeTo(companyUser.getTimeTo());
        company.setTimeFrom(companyUser.getTimeFrom());
        company.setDeleted((byte) 0);

        entityManager1.persist(company);
        companyUser.setId(company.getId());

        User user = new User();
        user.setActive((byte)1);
        user.setCompanyId(companyUser.getId());
        user.setDeactivationReason(null);
        user.setDeleted((byte) 0);
        user.setEmail(companyUser.getEmail());
        user.setFirstName(null);
        user.setLastName(null);
        user.setPassword(null);
        user.setId(null);
        user.setPhoto(null);
        user.setPin(null);
        user.setRoleId(1);
        entityManager1.persist(user);

        company.setId(company.getId());
        transaction.commit();
        entityManager1.close();

        return companyUser;

    }

    @Override
    @Transactional
    public CompanyUser updateExtended(Integer userId, CompanyUser companyUser) {

            EntityManager entityManager1 = emf.createEntityManager();
            EntityTransaction transaction = entityManager1.getTransaction();
            transaction.begin();

            User user = entityManager1.find(User.class, userId);
            Company company = entityManager1.find(Company.class, companyUser.getId());
            if((company.getDeleted() == (byte) 0) && (user.getDeleted() == (byte) 0)) {
                if (user != null && user.getCompanyId() == companyUser.getId() && !user.getEmail().equals(companyUser.getEmail())) {  // isti ID ali razlicite email adrese, u tom slucaju deaktiviraj korisnika i dodaj novog
                    user.setActive((byte) 0);
                    entityManager1.persist(user);

                    User user2 = new User();
                    user2.setId(null);
                    user2.setActive((byte) 1);
                    user2.setCompanyId(companyUser.getId());
                    user2.setDeactivationReason(null);
                    user2.setDeleted((byte) 0);
                    user2.setEmail(companyUser.getEmail());
                    user2.setFirstName(null);
                    user2.setLastName(null);
                    user2.setPassword(null);
                    user2.setId(null);
                    user2.setPhoto(null);
                    user2.setPin(null);
                    user2.setRoleId(1);
                    entityManager1.persist(user2);

                }

                company.setName(companyUser.getName());
                company.setTimeFrom(new Time(3333));
                company.setTimeTo(new Time(5555));
                transaction.commit();
                entityManager1.close();
                return companyUser;
            } else {
                return null;
            }

    }


}