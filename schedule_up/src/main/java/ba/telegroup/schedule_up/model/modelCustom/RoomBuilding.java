package ba.telegroup.schedule_up.model.modelCustom;

import ba.telegroup.schedule_up.model.Room;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "RoomBuildingMapping",
        classes = @ConstructorResult(
                targetClass = RoomBuilding.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "r.name"),
                        @ColumnResult(name = "floor"),
                        @ColumnResult(name = "capacity"),
                        @ColumnResult(name = "pin"),
                        @ColumnResult(name = "description"),
                        @ColumnResult(name = "building_id"),
                        @ColumnResult(name = "company_id"),
                        @ColumnResult(name = "b.name")
                }
        )
)
@MappedSuperclass
public class RoomBuilding extends Room {

    private String building_name;

    public RoomBuilding(){}

    public RoomBuilding(Integer id, String name, Integer floor, Integer capacity, byte[] pin, String description, Integer building_id, Integer company_id, String building_name){
        setId(id);
        setName(name);
        setFloor(floor);
        setCapacity(capacity);
        setPin(pin);
        setDescription(description);
        setBuildingId(building_id);
        setCompanyId(company_id);
        this.building_name = building_name;
    }

    public String getBuildingName() {
        return building_name;
    }

    public void setBuildingName(String building_name) {
        this.building_name = building_name;
    }

    @JsonIgnore
    @Override
    public Byte getDeleted() {
        return getDeleted();
    }
}
