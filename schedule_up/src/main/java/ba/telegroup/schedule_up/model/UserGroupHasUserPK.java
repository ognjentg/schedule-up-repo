package ba.telegroup.schedule_up.model;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Objects;

public class UserGroupHasUserPK implements Serializable {
    private Integer userGroupId;
    private Integer userId;

    @Column(name = "user_group_id", nullable = false)
    @Id
    public Integer getUserGroupId() {
        return userGroupId;
    }

    public void setUserGroupId(Integer userGroupId) {
        this.userGroupId = userGroupId;
    }

    @Column(name = "user_id", nullable = false)
    @Id
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
        UserGroupHasUserPK that = (UserGroupHasUserPK) o;
        return Objects.equals(userGroupId, that.userGroupId) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(userGroupId, userId);
    }
}
