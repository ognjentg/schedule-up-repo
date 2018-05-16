package ba.telegroup.schedule_up.model;

import javax.persistence.*;
import java.util.Arrays;
import java.util.Objects;

@Entity
public class Document {
    private Integer id;
    private String name;
    private byte[] content;
    private Byte report;
    private Integer meetingId;

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
    @Column(name = "name", nullable = false, length = 100)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "content", nullable = false)
    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    @Basic
    @Column(name = "report", nullable = false)
    public Byte getReport() {
        return report;
    }

    public void setReport(Byte report) {
        this.report = report;
    }

    @Basic
    @Column(name = "meeting_id", nullable = false)
    public Integer getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(Integer meetingId) {
        this.meetingId = meetingId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Document document = (Document) o;
        return Objects.equals(id, document.id) &&
                Objects.equals(name, document.name) &&
                Arrays.equals(content, document.content) &&
                Objects.equals(report, document.report) &&
                Objects.equals(meetingId, document.meetingId);
    }

    @Override
    public int hashCode() {

        int result = Objects.hash(id, name, report, meetingId);
        result = 31 * result + Arrays.hashCode(content);
        return result;
    }
}
