package ba.telegroup.schedule_up.model.modelCustom;

import ba.telegroup.schedule_up.model.Company;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;
import java.io.Serializable;
import java.util.Date;
import java.sql.Time;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "CompanyUserMapping",
        classes = @ConstructorResult(
                targetClass = CompanyUser.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "name"),
                        @ColumnResult(name="time_from"),
                        @ColumnResult(name="time_to"),
                        @ColumnResult(name="company_logo"),
                        @ColumnResult(name = "email")
                }
        )
)
@MappedSuperclass
public class CompanyUser extends Company implements Serializable {

    private String email;

    public CompanyUser() {
    }

    //Workaround to get time, DB returns java.util.Date
    public CompanyUser(Integer id, String name, Date timeFrom,Date timeTo,byte[] companyLogo,String email) {
        setId(id);
        setName(name);
        setTimeFrom(new Time(timeFrom.getTime()));
        setTimeTo(new Time(timeTo.getTime()));
        setCompanyLogo(companyLogo);
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Byte getDeleted() {
        return super.getDeleted();
    }
}
