package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "user_group_has_user", schema = "shedule_up_db", catalog = "")
@IdClass(UserGroupHasUserPK.class)
public class UserGroupHasUser {
    private Integer userGroupId;
    private Integer userId;

    @Id
    @Column(name = "user_group_id", nullable = false)
    public Integer getUserGroupId() {
        return userGroupId;
    }

    public void setUserGroupId(Integer userGroupId) {
        this.userGroupId = userGroupId;
    }

    @Id
    @Column(name = "user_id", nullable = false)
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserGroupHasUser that = (UserGroupHasUser) o;
        return Objects.equals(userGroupId, that.userGroupId) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(userGroupId, userId);
    }
}
