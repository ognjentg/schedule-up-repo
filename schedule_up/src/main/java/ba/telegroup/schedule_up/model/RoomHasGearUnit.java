package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "room_has_gear_unit", schema = "shedule_up_db", catalog = "")
@IdClass(RoomHasGearUnitPK.class)
public class RoomHasGearUnit {
    private Integer roomId;
    private Integer gearUnitId;
    private Byte currently;

    @Id
    @Column(name = "room_id", nullable = false)
    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    @Id
    @Column(name = "gear_unit_id", nullable = false)
    public Integer getGearUnitId() {
        return gearUnitId;
    }

    public void setGearUnitId(Integer gearUnitId) {
        this.gearUnitId = gearUnitId;
    }

    @Basic
    @Column(name = "currently", nullable = false)
    public Byte getCurrently() {
        return currently;
    }

    public void setCurrently(Byte currently) {
        this.currently = currently;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RoomHasGearUnit that = (RoomHasGearUnit) o;
        return Objects.equals(roomId, that.roomId) &&
                Objects.equals(gearUnitId, that.gearUnitId) &&
                Objects.equals(currently, that.currently);
    }

    @Override
    public int hashCode() {

        return Objects.hash(roomId, gearUnitId, currently);
    }
}
