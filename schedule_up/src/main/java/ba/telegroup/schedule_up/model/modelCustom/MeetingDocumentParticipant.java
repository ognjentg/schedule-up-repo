package ba.telegroup.schedule_up.model.modelCustom;

import ba.telegroup.schedule_up.model.Document;
import ba.telegroup.schedule_up.model.Meeting;
import ba.telegroup.schedule_up.model.Participant;
import java.util.List;

public class MeetingDocumentParticipant{
    private Meeting meeting;
    private List<Document> documents;
    private List<Participant> participants;

    public List<Document> getDocuments() {
        return documents;
    }
    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }
    public List<Participant> getParticipants() {
        return participants;
    }
    public void setParticipants(List<Participant> participants) {
        this.participants = participants;
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public void setMeeting(Meeting meeting) {
        this.meeting = meeting;
    }
}
