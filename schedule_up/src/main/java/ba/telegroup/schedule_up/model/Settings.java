package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.sql.Time;
import java.util.Objects;

@Entity
public class Settings {
    private Integer id;
    private Time reminderTime;
    private Time cancelTime;
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
    @Column(name = "reminder_time", nullable = false)
    public Time getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(Time reminderTime) {
        this.reminderTime = reminderTime;
    }

    @Basic
    @Column(name = "cancel_time", nullable = false)
    public Time getCancelTime() {
        return cancelTime;
    }

    public void setCancelTime(Time cancelTime) {
        this.cancelTime = cancelTime;
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
        Settings settings = (Settings) o;
        return Objects.equals(id, settings.id) &&
                Objects.equals(reminderTime, settings.reminderTime) &&
                Objects.equals(cancelTime, settings.cancelTime) &&
                Objects.equals(companyId, settings.companyId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, reminderTime, cancelTime, companyId);
    }
}
