package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HolidayRepository extends JpaRepository<Holiday,Integer>{
    List<Holiday> getAllByCompanyId(Integer companyId);
    List<Holiday> getAllByNameContainsAndCompanyId(String name, Integer companyId);
    List<Holiday> getAllByDateAfterAndCompanyId(java.sql.Date date, Integer companyId);
    List<Holiday> getAllByDateBeforeAndCompanyId(java.sql.Date date, Integer companyId);
    List<Holiday> getAllByDateBetweenAndCompanyId(java.sql.Date from, java.sql.Date to, Integer companyId);

    Holiday findOneByIdAndCompanyId(Integer id, Integer companyId);
    List<Holiday> getAllByDeletedEqualsAndCompanyId(byte deleted, Integer companyId);
    List<Holiday> getAllByCompanyIdAndDeletedEqualsAndCompanyId(Integer id, byte deleted, Integer companyId);
    List<Holiday> getAllByNameContainsIgnoreCaseAndDeletedEqualsAndCompanyId(String name, byte deleted, Integer companyId);
    List<Holiday> getAllByDateAfterAndDeletedEqualsAndCompanyId(java.sql.Date date, byte deleted, Integer companyId);
    List<Holiday> getAllByDateBeforeAndDeletedEqualsAndCompanyId(java.sql.Date date, byte deleted, Integer companyId);
    List<Holiday> getAllByDateBetweenAndDeletedEqualsAndCompanyId(java.sql.Date from, java.sql.Date to, byte deleted, Integer companyId);
}
