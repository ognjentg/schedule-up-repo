package ba.telegroup.schedule_up.model.modelCustom;


import ba.telegroup.schedule_up.model.Logger;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;
import java.sql.Timestamp;
import java.util.Date;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "LoggerUserMapping",
        classes = @ConstructorResult(
                targetClass = LoggerUser.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "action_type"),
                        @ColumnResult(name = "action_details"),
                        @ColumnResult(name = "table_name"),
                        @ColumnResult(name = "created"),
                        @ColumnResult(name = "user_id"),
                        @ColumnResult(name = "atomic"),
                        @ColumnResult(name = "company_id"),
                        @ColumnResult(name = "username")
                }
        )
)
@MappedSuperclass
public class LoggerUser extends Logger {
    private String username;

    public LoggerUser(){}

    public LoggerUser(Integer id, String actionType, String actionDetails, String tableName, Date created, Integer user_id, Byte atomic, Integer companyId, String username){
        setId(id);
        setActionType(actionType);
        setActionDetails(actionDetails);
        setTableName(tableName);
        setCreated(new Timestamp(created.getTime()));
        setAtomic(atomic);
        setUserId(user_id);
        setCompanyId(companyId);
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
