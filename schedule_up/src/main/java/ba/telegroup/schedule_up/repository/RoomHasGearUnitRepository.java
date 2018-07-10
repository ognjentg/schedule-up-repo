package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.RoomHasGearUnit;
import ba.telegroup.schedule_up.model.RoomHasGearUnitPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomHasGearUnitRepository extends JpaRepository<RoomHasGearUnit, RoomHasGearUnitPK>{
    RoomHasGearUnit getRoomHasGearUnitByRoomIdAndGearUnitId(Integer roomId, Integer gearUnitId);
}
