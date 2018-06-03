package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.util.Arrays;
import java.util.Objects;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Room {
    private Integer id;
    private String name;
    private Integer floor;
    private Integer capacity;
    private byte[] pin;
    private Byte deleted;
    private String description;
    private Integer buildingId;
    private Integer companyId;

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
    @Column(name = "name", nullable = false, length = 100)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "floor", nullable = false)
    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    @Basic
    @Column(name = "capacity", nullable = false)
    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    @Basic
    @Column(name = "pin", nullable = false)
    public byte[] getPin() {
        return pin;
    }

    public void setPin(byte[] pin) {
        this.pin = pin;
    }

    @Basic
    @Column(name = "deleted", nullable = false,insertable = false)
    public Byte getDeleted() {
        return deleted;
    }

    public void setDeleted(Byte deleted) {
        this.deleted = deleted;
    }

    @Basic
    @Column(name = "description", nullable = true, length = 500)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Basic
    @Column(name = "building_id", nullable = false)
    public Integer getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(Integer buildingId) {
        this.buildingId = buildingId;
    }

    @Basic
    @Column(name = "company_id", nullable = false)
    public Integer getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Integer companyId) {
        this.companyId = companyId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Room room = (Room) o;
        return Objects.equals(id, room.id) &&
                Objects.equals(name, room.name) &&
                Objects.equals(floor, room.floor) &&
                Objects.equals(capacity, room.capacity) &&
                Arrays.equals(pin, room.pin) &&
                Objects.equals(deleted, room.deleted) &&
                Objects.equals(description, room.description) &&
                Objects.equals(buildingId, room.buildingId) &&
                Objects.equals(companyId, room.companyId);
    }

    @Override
    public int hashCode() {

        int result = Objects.hash(id, name, floor, capacity, deleted, description, buildingId, companyId);
        result = 31 * result + Arrays.hashCode(pin);
        return result;
    }
}
