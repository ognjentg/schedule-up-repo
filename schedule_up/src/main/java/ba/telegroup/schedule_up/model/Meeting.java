package ba.telegroup.schedule_up.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;


import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
public class Meeting {
    private Integer id;
    private String topic;
    private Timestamp startTime;
    private Timestamp endTime;
    private Integer participantsNumber;
    private Byte status;
    private String description;
    private String cancelationReason;
    private Integer roomId;
    private Integer userId;
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
    @Column(name = "topic", nullable = false, length = 500)
    @JsonProperty("topic")
    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    @Basic
    @Column(name = "start_time", nullable = false)
    @JsonProperty("start_date")
    @JsonFormat
            (shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm",timezone="Europe/Belgrade")
    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    @Basic
    @Column(name = "end_time", nullable = false)
    @JsonProperty("end_date")
    @JsonFormat
            (shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm",timezone="Europe/Belgrade")
    public Timestamp getEndTime() {
        return endTime;
    }

    public void setEndTime(Timestamp endTime) {
        this.endTime = endTime;
    }

    @Basic
    @Column(name = "participants_number", nullable = false)
    public Integer getParticipantsNumber() {
        return participantsNumber;
    }

    public void setParticipantsNumber(Integer participantsNumber) {
        this.participantsNumber = participantsNumber;
    }

    @Basic
    @Column(name = "status", nullable = false)
    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    @Basic
    @Column(name = "description", length = 500)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Basic
    @Column(name = "cancelation_reason", length = 500)
    public String getCancelationReason() {
        return cancelationReason;
    }

    public void setCancelationReason(String cancelationReason) {
        this.cancelationReason = cancelationReason;
    }

    @Basic
    @Column(name = "room_id", nullable = false)
    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    @Basic
    @Column(name = "user_id", nullable = false)
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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
        Meeting meeting = (Meeting) o;
        return Objects.equals(id, meeting.id) &&
                Objects.equals(topic, meeting.topic) &&
                Objects.equals(startTime, meeting.startTime) &&
                Objects.equals(endTime, meeting.endTime) &&
                Objects.equals(participantsNumber, meeting.participantsNumber) &&
                Objects.equals(status, meeting.status) &&
                Objects.equals(description, meeting.description) &&
                Objects.equals(cancelationReason, meeting.cancelationReason) &&
                Objects.equals(roomId, meeting.roomId) &&
                Objects.equals(userId, meeting.userId) &&
                Objects.equals(companyId, meeting.companyId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, topic, startTime, endTime, participantsNumber, status, description, cancelationReason, roomId, userId, companyId);
    }

    @Override
    public String toString() {
        return "Meeting{" +
                "id=" + id +
                ", topic='" + topic + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", participantsNumber=" + participantsNumber +
                ", status=" + status +
                ", description='" + description + '\'' +
                ", cancelationReason='" + cancelationReason + '\'' +
                ", roomId=" + roomId +
                ", userId=" + userId +
                ", companyId=" + companyId +
                '}';
    }
}
