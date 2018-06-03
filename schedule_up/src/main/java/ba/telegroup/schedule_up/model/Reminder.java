package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.sql.Time;
import java.util.Objects;

@Entity
public class Reminder {
    private Integer id;
    private Time time;
    private Byte deleted;
    private Integer meetingId;
    private Integer userId;

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
    @Column(name = "time", nullable = false)
    public Time getTime() {
        return time;
    }

    public void setTime(Time time) {
        this.time = time;
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
    @Column(name = "meeting_id", nullable = false)
    public Integer getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(Integer meetingId) {
        this.meetingId = meetingId;
    }

    @Basic
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
        Reminder reminder = (Reminder) o;
        return Objects.equals(id, reminder.id) &&
                Objects.equals(time, reminder.time) &&
                Objects.equals(deleted, reminder.deleted) &&
                Objects.equals(meetingId, reminder.meetingId) &&
                Objects.equals(userId, reminder.userId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, time, deleted, meetingId, userId);
    }
}
