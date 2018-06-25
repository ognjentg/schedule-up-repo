package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@SqlResultSetMapping(
        name = "GearMapping",
        classes = @ConstructorResult(
                targetClass = Gear.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "name")
                }
        )
)
public class Gear {
    private Integer id;
    private String name;

    public Gear(){}
    public Gear(Integer id, String name){
        setId(id);
        setName(name);
    }
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Gear gear = (Gear) o;
        return Objects.equals(id, gear.id) &&
                Objects.equals(name, gear.name);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, name);
    }
}
