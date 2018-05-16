package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "unavailable_period", schema = "shedule_up_db", catalog = "")
public class UnavailablePeriod {
    private Integer id;
    private Timestamp unavailableFrom;
    private Timestamp unavailableTo;
    private Integer companyId;
    private Integer buildingId;
    private Integer roomId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "unavailable_from", nullable = false)
    public Timestamp getUnavailableFrom() {
        return unavailableFrom;
    }

    public void setUnavailableFrom(Timestamp unavailableFrom) {
        this.unavailableFrom = unavailableFrom;
    }

    @Basic
    @Column(name = "unavailable_to", nullable = false)
    public Timestamp getUnavailableTo() {
        return unavailableTo;
    }

    public void setUnavailableTo(Timestamp unavailableTo) {
        this.unavailableTo = unavailableTo;
    }

    @Basic
    @Column(name = "company_id", nullable = false)
    public Integer getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Integer companyId) {
        this.companyId = companyId;
    }

    @Basic
    @Column(name = "building_id", nullable = true)
    public Integer getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(Integer buildingId) {
        this.buildingId = buildingId;
    }

    @Basic
    @Column(name = "room_id", nullable = true)
    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UnavailablePeriod that = (UnavailablePeriod) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(unavailableFrom, that.unavailableFrom) &&
                Objects.equals(unavailableTo, that.unavailableTo) &&
                Objects.equals(companyId, that.companyId) &&
                Objects.equals(buildingId, that.buildingId) &&
                Objects.equals(roomId, that.roomId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, unavailableFrom, unavailableTo, companyId, buildingId, roomId);
    }
}
