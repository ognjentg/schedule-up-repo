package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingRepository extends JpaRepository<Building, Integer> {

    List<Building> getAllByCompanyIdAndDeletedEquals(Integer id,Byte deleted);
    List<Building> getAllByCompanyIdAndNameContainsIgnoreCaseAndDeletedEquals(Integer id,String name,Byte deleted);
    List<Building> getAllByCompanyIdAndLongitudeAndLatitudeAndDeletedEquals(Integer id,Double longitude, Double latitude,Byte deleted);
    Building getBuildingsById(Integer id);
}
