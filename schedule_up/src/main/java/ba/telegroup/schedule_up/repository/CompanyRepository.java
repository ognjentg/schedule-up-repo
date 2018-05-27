package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Company;
import ba.telegroup.schedule_up.repository.repositoryCustom.CompanyRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Integer>, CompanyRepositoryCustom {

    List<Company> getAllByIdIsAfter(Integer id);

    List<Company> getByNameContains(String name);


}
