package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.Company;
import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;
import ba.telegroup.schedule_up.repository.UserRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.CompanyRepositoryCustom;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

public class CompanyRepositoryImpl implements CompanyRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT c.id, c.name,c.time_from,c.time_to,c.company_logo, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE c.deleted=0 AND u.deleted=0 AND (u.active=1 OR (u.active=0 AND u.token IS NOT NULL AND NOW() < ADDTIME(u.token_time, '00:10:00'))) AND u.role_id=2";
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
    public long getCompanyWorkTimeAsMillis(Company company, Date dateFrom, Date dateTo){
        if(company != null){
            long dailyWorkTime = company.getTimeTo().getTime() - company.getTimeFrom().getTime();

            LocalDate localDateFrom = dateFrom.toLocalDate();
            LocalDate localDateTo = dateTo.toLocalDate();

            int counterOfWorkingDays = 0;
            for(LocalDate date = localDateFrom; localDateTo.isAfter(date); date = date.plusDays(1) ){
                if(!date.getDayOfWeek().equals(DayOfWeek.SATURDAY) && !date.getDayOfWeek().equals(DayOfWeek.SUNDAY))
                    counterOfWorkingDays++;
            }
            return counterOfWorkingDays*dailyWorkTime;
        } else
            return 0;
    }
}