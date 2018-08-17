package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Building;
import ba.telegroup.schedule_up.model.Room;
import ba.telegroup.schedule_up.repository.repositoryCustom.RoomRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer>, RoomRepositoryCustom {

    Room getRoomById(Integer id);
    List<Room> getByCompanyId(Integer companyId);
    List<Room> getRoomsByBuildingId(Integer buildingId);
}
