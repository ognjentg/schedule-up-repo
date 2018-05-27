package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.Company;
import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;

import java.util.List;

public interface CompanyRepositoryCustom {

    List<CompanyUser> getAllExtended();

    List getAllExtendedById(Integer id);

    List getAllExtendedByNameContains(String name);

    CompanyUser getByIdAndEmail(Integer id, String email);

    String updateExtended(Integer id, String email, CompanyUser companyUser);

    String deleteCompany(Company company);
}
