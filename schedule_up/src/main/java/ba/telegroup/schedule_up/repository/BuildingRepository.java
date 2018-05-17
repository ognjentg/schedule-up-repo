package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingRepository extends JpaRepository<Building, Integer> {

    List<Building> getAllByCompanyId(Integer id);
    List<Building> getAllByCompanyIdAndDeletedIsFalse(Integer id);
    List<Building> getAllByNameContains(String name);
    List<Building> getAllByLongitudeAndLatitude(Double longitude, Double latitude);
    List<Building> getAllByCompanyIdAndLongitudeAndLatitude(Integer id, Double longitude, Double latitude);
}
