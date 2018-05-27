package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.GearUnit;
import ba.telegroup.schedule_up.repository.repositoryCustom.GearUnitRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GearUnitRepository extends JpaRepository<GearUnit, Integer>, GearUnitRepositoryCustom {
}
