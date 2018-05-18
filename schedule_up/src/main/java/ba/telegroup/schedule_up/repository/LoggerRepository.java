package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Logger;
import ba.telegroup.schedule_up.repository.repositoryCustom.LoggerRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoggerRepository extends JpaRepository<Logger, Integer>, LoggerRepositoryCustom {

}
