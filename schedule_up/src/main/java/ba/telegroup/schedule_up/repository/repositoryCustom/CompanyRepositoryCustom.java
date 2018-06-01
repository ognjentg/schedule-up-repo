package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.Company;
import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;

import java.util.List;

public interface CompanyRepositoryCustom {

    List<CompanyUser> getAllExtended();

    CompanyUser getAllExtendedById(Integer userId);

    List getAllExtendedByNameContains(String name);

    CompanyUser updateExtended(Integer userId, CompanyUser companyUser);

    String deleteCompany(Company company);

    CompanyUser insertExtended(CompanyUser companyUser);
}
