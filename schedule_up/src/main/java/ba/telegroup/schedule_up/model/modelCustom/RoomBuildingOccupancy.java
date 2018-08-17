package ba.telegroup.schedule_up.model.modelCustom;

import ba.telegroup.schedule_up.model.Room;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;
import java.io.Serializable;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "RoomBuildingOccupancyMapping",
        classes = @ConstructorResult(
                targetClass = RoomBuildingOccupancy.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "name"),
                        @ColumnResult(name = "floor"),
                        @ColumnResult(name="capacity"),
                        @ColumnResult(name="description"),
                        @ColumnResult(name="building_name")
                }
        )
)
@MappedSuperclass
public class RoomBuildingOccupancy extends Room implements Serializable {

    private String buildingName;
    private Double occupancy;

    public RoomBuildingOccupancy(){}

    public RoomBuildingOccupancy(Integer id, String name, Integer floor, Integer capacity, String description, String buildingName){
        setId(id);
        setName(name);
        setFloor(floor);
        setCapacity(capacity);
        setDescription(description);
        this.buildingName = buildingName;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public Double getOccupancy() {
        return occupancy;
    }

    public void setOccupancy(Double occupancy) {
        this.occupancy = occupancy;
    }
}
