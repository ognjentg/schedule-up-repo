package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.Room;
import ba.telegroup.schedule_up.repository.repositoryCustom.RoomRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Integer>, RoomRepositoryCustom {
}
