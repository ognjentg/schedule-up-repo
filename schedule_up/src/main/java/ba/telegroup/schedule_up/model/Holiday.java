package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
public class Holiday {
    private Integer id;
    private Date date;
    private Byte deleted;
    private String name;
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
    @Column(name = "date", nullable = false)
    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
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
    @Column(name = "name", nullable = true, length = 100)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
        Holiday holiday = (Holiday) o;
        return Objects.equals(id, holiday.id) &&
                Objects.equals(date, holiday.date) &&
                Objects.equals(deleted, holiday.deleted) &&
                Objects.equals(name, holiday.name) &&
                Objects.equals(companyId, holiday.companyId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, date, deleted, name, companyId);
    }
}
