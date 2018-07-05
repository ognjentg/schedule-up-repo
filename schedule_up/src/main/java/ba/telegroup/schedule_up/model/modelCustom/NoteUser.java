package ba.telegroup.schedule_up.model.modelCustom;

import ba.telegroup.schedule_up.model.Note;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "NoteUserMapping",
        classes = @ConstructorResult(
                targetClass = NoteUser.class,
                columns = {
                        @ColumnResult(name = "id", type = Integer.class),
                        @ColumnResult(name = "name", type = String.class),
                        @ColumnResult(name = "description", type = String.class),
                        @ColumnResult(name="publish_time", type = Timestamp.class),
                        @ColumnResult(name="deleted", type = Byte.class),
                        @ColumnResult(name="user_id", type = Integer.class),
                        @ColumnResult(name="company_id", type = Integer.class),
                        @ColumnResult(name="expired_time", type = Timestamp.class),
                        @ColumnResult(name = "username", type = String.class)
                }
        )
)
@MappedSuperclass
public class NoteUser extends Note {

    private String username;

    public NoteUser() {
    }

    @SuppressWarnings("WeakerAccess")
    public NoteUser(Integer id, String name, String description, Date publish_time, Byte deleted,
                    Integer user_id, Integer company_id, Date expired_time, String username) {
        setId(id);
        setName(name);
        setDescription(description);
        setPublishTime(new Timestamp(publish_time.getTime()));
        setDeleted(deleted);
        setUserId(user_id);
        setCompanyId(company_id);
        setExpiredTime(new Timestamp(expired_time.getTime()));
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @JsonIgnore
    @Override
    public Byte getDeleted() {
        return super.getDeleted();
    }

}
