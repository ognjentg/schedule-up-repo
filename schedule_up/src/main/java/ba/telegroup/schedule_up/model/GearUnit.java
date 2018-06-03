package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "gear_unit", schema = "shedule_up_db", catalog = "")
@Inheritance(strategy = InheritanceType.JOINED)
public class GearUnit {
    private Integer id;
    private Byte available;
    private Byte deleted;
    private String description;
    private Integer gearId;
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
    @Column(name = "available", nullable = false)
    public Byte getAvailable() {
        return available;
    }

    public void setAvailable(Byte available) {
        this.available = available;
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
    @Column(name = "gear_id", nullable = false)
    public Integer getGearId() {
        return gearId;
    }

    public void setGearId(Integer gearId) {
        this.gearId = gearId;
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
        GearUnit gearUnit = (GearUnit) o;
        return Objects.equals(id, gearUnit.id) &&
                Objects.equals(available, gearUnit.available) &&
                Objects.equals(deleted, gearUnit.deleted) &&
                Objects.equals(description, gearUnit.description) &&
                Objects.equals(gearId, gearUnit.gearId) &&
                Objects.equals(companyId, gearUnit.companyId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, available, deleted, description, gearId, companyId);
    }
}
