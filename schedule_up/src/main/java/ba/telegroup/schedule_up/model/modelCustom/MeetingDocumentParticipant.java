package ba.telegroup.schedule_up.model.modelCustom;

import ba.telegroup.schedule_up.model.*;

import java.util.List;

public class MeetingDocumentParticipant{
    private Meeting meeting;
    private User author;
    private List<Document> documents;
    private List<User> participantsUser;
    private List<UserGroup> participantsGroup;
    private List<String> participantsOther;
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

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public List<User> getParticipantsUser() {
        return participantsUser;
    }

    public void setParticipantsUser(List<User> participantsUser) {
        this.participantsUser = participantsUser;
    }

    public List<UserGroup> getParticipantsGroup() {
        return participantsGroup;
    }

    public void setParticipantsGroup(List<UserGroup> participantsGroup) {
        this.participantsGroup = participantsGroup;
    }

    public List<String> getParticipantsOther() {
        return participantsOther;
    }

    public void setParticipantsOther(List<String> participantsOther) {
        this.participantsOther = participantsOther;
    }
}
