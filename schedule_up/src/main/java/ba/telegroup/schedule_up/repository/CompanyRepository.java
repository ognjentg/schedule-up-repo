package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company,Integer> {
}
