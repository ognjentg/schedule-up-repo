package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Building {
    private Integer id;
    private String name;
    private Double longitude;
    private Double latitude;
    private Byte deleted;
    private String description;
    private Integer companyId;
    private String address;

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
    @Column(name = "longitude", precision = 6)
    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    @Basic
    @Column(name = "latitude", precision = 6)
    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    @Basic
    @Column(name="address",nullable = false)
    public String getAddress(){ return address;}
    public void setAddress(String address){ this.address=address;}
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
        Building building = (Building) o;
        return Objects.equals(id, building.id) &&
                Objects.equals(name, building.name) &&
                Objects.equals(longitude, building.longitude) &&
                Objects.equals(latitude, building.latitude) &&
                Objects.equals(deleted, building.deleted) &&
                Objects.equals(description, building.description) &&
                Objects.equals(companyId, building.companyId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, name, longitude, latitude, deleted, description, companyId);
    }
}
