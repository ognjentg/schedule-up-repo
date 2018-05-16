package ba.telegroup.schedule_up.model.modelCustom;

import ba.telegroup.schedule_up.model.Company;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;
import java.sql.Time;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "CompanyUserMapping",
        classes = @ConstructorResult(
                targetClass = CompanyUser.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "name"),
                        @ColumnResult(name = "email")
                }
        )
)
@MappedSuperclass
public class CompanyUser extends Company {

    private String email;

    public CompanyUser() {
    }

    public CompanyUser(Integer id, String name, String email) {
        setId(id);
        setName(name);
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @JsonIgnore
    @Override
    public Byte getDeleted() {
        return super.getDeleted();
    }

    @JsonIgnore
    @Override
    public Time getTimeFrom() {
        return super.getTimeFrom();
    }

    @JsonIgnore
    @Override
    public Time getTimeTo() {
        return super.getTimeTo();
    }
}
