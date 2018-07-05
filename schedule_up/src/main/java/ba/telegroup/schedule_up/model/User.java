package ba.telegroup.schedule_up.model;

import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;
import org.joda.time.DateTime;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.Objects;

@SqlResultSetMapping(
        name = "UserMapping",
        classes = @ConstructorResult(
                targetClass = User.class,
                columns = {
                        @ColumnResult(name="id"),
                        @ColumnResult(name="email"),
                        @ColumnResult(name="username"),
                        @ColumnResult(name="password"),
                        @ColumnResult(name="pin"),
                        @ColumnResult(name="first_name"),
                        @ColumnResult(name="last_name"),
                        @ColumnResult(name="photo"),
                        @ColumnResult(name="active"),
                        @ColumnResult(name="deactivation_reason"),
                        @ColumnResult(name="token"),
                        @ColumnResult(name="company_id"),
                        @ColumnResult(name="role_id"),
                        @ColumnResult(name="token_time", type = Date.class),
                        @ColumnResult(name="deleted", type = Byte.class)
                }
        )
)
@Entity
public class User {
    private Integer id;
    private String email;
    private String username;
    private String password;
    private String pin;
    private String firstName;
    private String lastName;
    private byte[] photo;
    private Byte active;
    private Byte deleted;
    private String deactivationReason;
    private String token;
    private Timestamp tokenTime;
    private Integer companyId;
    private Integer roleId;
    public User()
    {

    }
    public User(Integer id, String email, String username, String password, String pin, String first_name, String last_name,
                byte[] photo, Byte active, String deactivation_reason, String token,
                Integer company_id, Integer role_id, Date token_time, Byte deleted)
    {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.pin = pin;
        this.firstName = first_name;
        this.lastName = last_name;
        this.photo = photo;
        this.active = active;
        this.deactivationReason = deactivation_reason;
        this.token = token;
        this.companyId = company_id;
        this.roleId = role_id;
        this.deleted = deleted;
        setTokenTime(token_time==null ? null:new Timestamp(token_time.getTime()));
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
    @Column(name = "email", nullable = false, length = 100)
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Basic
    @Column(name = "username", nullable = true, length = 100)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Basic
    @Column(name = "password", nullable = true, length = 128)
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Basic
    @Column(name = "pin", nullable = true, length = 128)
    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    @Basic
    @Column(name = "first_name", nullable = true, length = 100)
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @Basic
    @Column(name = "last_name", nullable = true, length = 100)
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @Basic
    @Column(name = "photo", nullable = true)
    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    @Basic
    @Column(name = "active", nullable = false)
    public Byte getActive() {
        return active;
    }

    public void setActive(Byte active) {
        this.active = active;
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
    @Column(name = "deactivation_reason", nullable = true, length = 500)
    public String getDeactivationReason() {
        return deactivationReason;
    }

    public void setDeactivationReason(String deactivationReason) {
        this.deactivationReason = deactivationReason;
    }

    @Basic
    @Column(name = "token", nullable = true, length = 16)
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Basic
    @Column(name = "token_time", nullable = false)
    public Timestamp getTokenTime() {
        return tokenTime;
    }

    public void setTokenTime(Timestamp tokenTime) {
        this.tokenTime = tokenTime;
    }

    @Basic
    @Column(name = "company_id", nullable = false)
    public Integer getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Integer companyId) {
        this.companyId = companyId;
    }

    @Basic
    @Column(name = "role_id", nullable = false)
    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) &&
                Objects.equals(email, user.email) &&
                Objects.equals(username, user.username) &&
                Objects.equals(password, user.password) &&
                Objects.equals(pin, user.pin) &&
                Objects.equals(firstName, user.firstName) &&
                Objects.equals(lastName, user.lastName) &&
                Arrays.equals(photo, user.photo) &&
                Objects.equals(active, user.active) &&
                Objects.equals(deleted, user.deleted) &&
                Objects.equals(deactivationReason, user.deactivationReason) &&
                Objects.equals(token, user.token) &&
                Objects.equals(tokenTime, user.tokenTime) &&
                Objects.equals(companyId, user.companyId) &&
                Objects.equals(roleId, user.roleId);
    }

    @Override
    public int hashCode() {

        int result = Objects.hash(id, email, username, password, pin, firstName, lastName, active, deleted, deactivationReason, token, tokenTime, companyId, roleId);
        result = 31 * result + Arrays.hashCode(photo);
        return result;
    }
}
