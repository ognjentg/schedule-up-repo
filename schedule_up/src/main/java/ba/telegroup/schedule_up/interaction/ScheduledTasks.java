package ba.telegroup.schedule_up.interaction;

import java.text.SimpleDateFormat;
import java.util.*;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.model.Meeting;
import ba.telegroup.schedule_up.model.Participant;
import ba.telegroup.schedule_up.model.Settings;
import ba.telegroup.schedule_up.repository.MeetingRepository;
import ba.telegroup.schedule_up.repository.ParticipantRepository;
import ba.telegroup.schedule_up.repository.SettingsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {
    private static final int intervalRate = 60000;
    private final SettingsRepository settingsRepository;
    private final MeetingRepository meetingRepository;
    private final ParticipantRepository participantRepository;
    @Autowired
    public ScheduledTasks(SettingsRepository settingsRepository, MeetingRepository meetingRepository, ParticipantRepository participantRepository)
    {
        this.settingsRepository = settingsRepository;
        this.meetingRepository = meetingRepository;
        this.participantRepository = participantRepository;
    }
    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy. HH:mm:ss");

    @Scheduled(fixedRate = intervalRate)
    public void meetingMailReminder() {
        Date currentTime = new Date();
        List<Settings> settings = settingsRepository.getAll();
        HashMap<Integer, Long> companyIdReminderTime = new HashMap<>();
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeZone(TimeZone.getDefault());
        for(Settings set : settings)
        {
            calendar.setTime(set.getReminderTime());
            companyIdReminderTime.put(set.getCompanyId(), (set.getReminderTime().getHours()*3600l + set.getReminderTime().getMinutes()*60l + set.getReminderTime().getSeconds())*1000l);
        }
        List<Meeting> meetings = meetingRepository.getAllScheduled();
        meetings.stream().forEach(meeting -> {
            if(Math.abs(meeting.getStartTime().getTime() - companyIdReminderTime.get(meeting.getCompanyId()) - currentTime.getTime()) < intervalRate/2)
            {
                List<Participant> participants = participantRepository.getAllByMeetingIdAndDeletedIs(meeting.getId(), (byte)0);
                participants.stream().forEach(participant -> {
                    try {
                        new Notification().notify(participant.getEmail(), "Imate sastanak \""
                                + meeting.getTopic() +": "+meeting.getDescription()+"\", " + dateFormat.format(meeting.getStartTime()));
                    } catch (BadRequestException e) {
                    }
                });
            }
        });

    }
}