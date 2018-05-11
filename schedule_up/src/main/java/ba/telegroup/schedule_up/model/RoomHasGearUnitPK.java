package ba.telegroup.schedule_up.model;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Objects;

public class RoomHasGearUnitPK implements Serializable {
    private Integer roomId;
    private Integer gearUnitId;

    @Column(name = "room_id", nullable = false)
    @Id
    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    @Column(name = "gear_unit_id", nullable = false)
    @Id
    public Integer getGearUnitId() {
        return gearUnitId;
    }

    public void setGearUnitId(Integer gearUnitId) {
        this.gearUnitId = gearUnitId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RoomHasGearUnitPK that = (RoomHasGearUnitPK) o;
        return Objects.equals(roomId, that.roomId) &&
                Objects.equals(gearUnitId, that.gearUnitId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(roomId, gearUnitId);
    }
}
