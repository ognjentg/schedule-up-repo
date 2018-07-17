package ba.telegroup.schedule_up.model.modelCustom;

import ba.telegroup.schedule_up.model.GearUnit;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "GearUnitGearMapping",
        classes = @ConstructorResult(
                targetClass = GearUnitGear.class,
                columns = {
                        @ColumnResult(name = "id", type = Integer.class),
                        @ColumnResult(name = "available", type = Byte.class),
//                        @ColumnResult(name = "deleted", type = Byte.class),
                        @ColumnResult(name = "description", type = String.class),
                        @ColumnResult(name = "gear_id", type = Integer.class),
                        @ColumnResult(name = "company_id", type = Integer.class),
                        @ColumnResult(name = "inventory_number", type = String.class),
                        @ColumnResult(name = "name", type = String.class)
                }
        )
)
@MappedSuperclass
public class GearUnitGear extends GearUnit {
    private String name;

    public GearUnitGear() {

    }

    @SuppressWarnings("WeakerAccess")
    public GearUnitGear(Integer id, Byte available, String description, Integer gear_id, Integer company_id, String inventory_number,
                        String name) {
        setId(id);
        setAvailable(available);

        setDescription(description);
        setGearId(gear_id);
        setCompanyId(company_id);
        setInventoryNumber(inventory_number);
        this.name = name;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    @Override
    @JsonIgnore
    public Byte getDeleted() { return super.getDeleted(); }

}
