package ba.telegroup.schedule_up.interaction;

import ba.telegroup.schedule_up.model.Meeting;
import ba.telegroup.schedule_up.model.Participant;
import microsoft.exchange.webservices.data.core.ExchangeService;
import microsoft.exchange.webservices.data.core.enumeration.availability.AvailabilityData;
import microsoft.exchange.webservices.data.core.enumeration.misc.ExchangeVersion;
import microsoft.exchange.webservices.data.core.enumeration.misc.error.ServiceError;
import microsoft.exchange.webservices.data.core.enumeration.service.ConflictResolutionMode;
import microsoft.exchange.webservices.data.core.response.AttendeeAvailability;
import microsoft.exchange.webservices.data.core.service.item.Appointment;
import microsoft.exchange.webservices.data.credential.ExchangeCredentials;
import microsoft.exchange.webservices.data.credential.WebCredentials;
import microsoft.exchange.webservices.data.misc.availability.AttendeeInfo;
import microsoft.exchange.webservices.data.misc.availability.GetUserAvailabilityResults;
import microsoft.exchange.webservices.data.misc.availability.TimeWindow;
import microsoft.exchange.webservices.data.property.complex.MessageBody;
import microsoft.exchange.webservices.data.property.complex.availability.CalendarEvent;
import microsoft.exchange.webservices.data.property.complex.availability.Suggestion;
import microsoft.exchange.webservices.data.property.complex.availability.TimeSuggestion;
import microsoft.exchange.webservices.data.property.complex.recurrence.pattern.Recurrence;

import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

public class ExchangeServer {
    private ExchangeService  service = null;

    /**
     *
     * @param email
     * @param password
     * @param version
     * @throws Exception
     */
    public ExchangeServer(String email, String password, ExchangeVersion version) throws Exception {
        init(email, password, version);
        service.autodiscoverUrl(email);
    }

    /**
     *
     * @param url
     * @param email
     * @param password
     * @param version
     * @throws Exception
     */
    public ExchangeServer(String url, String email, String password, ExchangeVersion version) throws Exception {
        init(email, password, version);
        service.setUrl(new URI(url));
    }
    private void init(String email, String password, ExchangeVersion version)
    {
        service = new ExchangeService(version);
        ExchangeCredentials credentials = new WebCredentials(email, password);
        service.setCredentials(credentials);
    }

    /**
     *
     * @param meeting
     * @param requieredParticipants
     * @param optionalParticipants
     * @return
     */
    public boolean createMeeting(Meeting meeting, List<Participant> requieredParticipants, List<Participant> optionalParticipants)
    {
        try {
            Appointment appointment = new Appointment(service);
            appointment.setSubject(meeting.getTopic());
            appointment.setBody(MessageBody.getMessageBodyFromText(meeting.getDescription()));

            Date startDate = new Date(meeting.getStartTime().getTime());
            Date endDate = new Date(meeting.getEndTime().getTime());

            appointment.setStart(startDate);
            appointment.setEnd(endDate);

            if(requieredParticipants != null) {
                for (Participant participant : requieredParticipants) {
                    appointment.getRequiredAttendees().add(participant.getEmail());
                    appointment.update(ConflictResolutionMode.AutoResolve);
                }
            }
            if(optionalParticipants != null) {
                for (Participant participant : optionalParticipants) {
                    appointment.getOptionalAttendees().add(participant.getEmail());
                    appointment.update(ConflictResolutionMode.AutoResolve);
                }
            }
            appointment.save();
        }catch (Exception e)
        {
            return false;
        }
        return  true;
    }

    /**
     * Minimum time frame allowed is 24 hours
     * Return start-end date array for participants
     * @param participants
     * @param start
     * @param end
     * @return
     */
    public HashMap<Participant, Date[][]> getParticipantAvailability(List<Participant> participants, Date start, Date end) throws Exception
    {
        List<AttendeeInfo> attendees = new ArrayList<AttendeeInfo>();
        for(Participant participant : participants)
        {
            attendees.add(new AttendeeInfo(participant.getEmail()));
        }
        GetUserAvailabilityResults userAvailability = service.getUserAvailability(
                attendees,
                new TimeWindow(start, end),
                AvailabilityData.FreeBusyAndSuggestions);

        HashMap<Participant, Date[][]> result = new HashMap<>();

        int attendeeIndex = 0;

        for (AttendeeAvailability attendeeAvailability : userAvailability.getAttendeesAvailability()) {
            if (attendeeAvailability.getErrorCode() == ServiceError.NoError) {
                Date[][] dates = new Date[attendeeAvailability.getCalendarEvents().size()][2];
                int eventIndex = 0;
                for (CalendarEvent calendarEvent : attendeeAvailability.getCalendarEvents()) {
                    dates[eventIndex][0] = new Date(calendarEvent.getStartTime().getTime());
                    dates[eventIndex][1] = new Date(calendarEvent.getEndTime().getTime());
                    eventIndex++;
                }
                result.put(participants.get(attendeeIndex), dates);
            }

            attendeeIndex++;
        }
        return result;
    }

    /**
     * Minimum time frame allowed is 24 hours
     * @param participants
     * @param start
     * @param end
     * @return
     * @throws Exception
     */
    public HashMap<Date, Date[]> getSuggestedTimes(List<Participant> participants, Date start, Date end) throws Exception
    {
        List<AttendeeInfo> attendees = new ArrayList<AttendeeInfo>();
        for(Participant participant : participants)
        {
            attendees.add(new AttendeeInfo(participant.getEmail()));
        }
        GetUserAvailabilityResults userAvailability = service.getUserAvailability(
                attendees,
                new TimeWindow(start, end),
                AvailabilityData.FreeBusyAndSuggestions);
        HashMap<Date, Date[]> result = new HashMap<>();

        for (Suggestion suggestion : userAvailability.getSuggestions()) {
            Date[] dates = new Date[userAvailability.getSuggestions().size()];
            int timeSuggestionIndex = 0;
            for (TimeSuggestion timeSuggestion : suggestion.getTimeSuggestions()) {
                dates[timeSuggestionIndex] = timeSuggestion.getMeetingTime();
                timeSuggestionIndex++;
            }
            result.put(suggestion.getDate(), dates);
        }
        return result;
    }
}
