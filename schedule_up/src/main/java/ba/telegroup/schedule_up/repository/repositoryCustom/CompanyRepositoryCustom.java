package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.Company;
import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;

import java.sql.Date;
import java.util.List;

public interface CompanyRepositoryCustom {

    List<CompanyUser> getAllExtended();

    CompanyUser getAllExtendedById(Integer userId);

    List getAllExtendedByNameContains(String name);

    String deleteCompany(Company company);

    long getCompanyWorkTimeAsMillis(Company company, Date dateFrom, Date dateTo);
}
