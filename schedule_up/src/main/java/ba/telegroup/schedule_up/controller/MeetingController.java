package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.interaction.Notification;
import ba.telegroup.schedule_up.model.Document;
import ba.telegroup.schedule_up.model.Meeting;
import ba.telegroup.schedule_up.model.Participant;
import ba.telegroup.schedule_up.model.modelCustom.MeetingDocumentParticipant;
import ba.telegroup.schedule_up.repository.*;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequestMapping(value = "/meeting")
@Controller
@Scope("request")
public class MeetingController extends GenericController<Meeting, Integer> {
    private final MeetingRepository meetingRepository;
    private final SettingsRepository settingsRepository;
    private final ParticipantRepository participantRepository;
    private final DocumentRepository documentRepository;
    @Value("${admin.id}")
    private Integer admin;
    @Value("${superAdmin.id}")
    private Integer superAdmin;
    @Value("${advancedUser.id}")
    private Integer advancedUser;
    @Value("${user.id}")
    private Integer user;
    @Value("${meetingStatus.scheduled}")
    private Byte scheduled;
    @Value("${meetingStatus.finished}")
    private Byte finished;
    @Value("${meetingStatus.canceled}")
    private Byte canceled;
    @Value("${badRequest.noMeeting}")
    private String noMeeting;
    @Value("${badRequest.alreadyFinished}")
    private String alreadyFinished;
    @Value("${badRequest.update}")
    private String update;
    @Value("${forbidden.notAuthorized}")
    private String forbiddenNotAuthorized;
    @Value("${badRequest.participantNotExist}")
    private String badRequestParticipantNotExist;
    @Value("${badRequest.update}")
    private String badRequestUpdate;
    @Value("${badRequest.meetingNotExist}")
    private String badRequestMeetingNotExist;
    @Value("${badRequest.participantExist}")
    private String badRequestParticipantExist;
    @Value("${success.action}")
    private String success;
    @Value("${badRequest}")
    private String badRequest;
    @Value("${badRequest.delete}")
    private String badRequestDelete;
    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;
    @Value("${badRequest.minimalCancelTime}")
    private String badRequestMinimalCancelTime;
    @Value("${badRequest.userNull}")
    private String userNull;
    @Value("${badRequest.dateTimeCompare}")
    private String badRequestDateTimeCompare;
    @Value("${badRequest.status}")
    private String badRequestStatus;
    @Value("${badRequest.meetingPeriodViolation}")
    private String badRequestMeetingPeriodViolation;
    @Value("${badRequest.meetingCompanyMismatch}")
    private String badRequestMeetingCompanyMismatch;

    @Autowired
    public MeetingController(MeetingRepository meetingRepository, SettingsRepository settingsRepository, ParticipantRepository participantRepository, DocumentRepository documentRepository) {
        super(meetingRepository);
        this.meetingRepository = meetingRepository;
        this.settingsRepository = settingsRepository;
        this.participantRepository = participantRepository;
        this.documentRepository = documentRepository;

    }


    @Override
    public @ResponseBody
    List<Meeting> getAll() throws ForbiddenException {
        if (userBean.getUser().getRoleId().equals(admin)) {
            return meetingRepository.getAllByStatusInAndCompanyId(new Byte[]{scheduled, finished}, userBean.getUser().getCompanyId());
        }
        else if(userBean.getUser().getRoleId().equals(advancedUser) || userBean.getUser().getRoleId().equals(user)){
            return meetingRepository.getAllByUserId(userBean.getUser().getId());
        }
        throw new ForbiddenException(forbiddenNotAuthorized);
    }


    @RequestMapping(value = "/finish/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String finish(@PathVariable Integer id) throws BadRequestException, ForbiddenException {
        Meeting meeting = meetingRepository.findById(id).orElse(null);
        if (meeting == null)
            throw new BadRequestException(noMeeting);
        if (meeting.getStatus() .equals( finished))
            throw new BadRequestException(alreadyFinished);
        if (userBean.getUser().getRoleId().equals(admin) || userBean.getUser().getId() == meeting.getUserId()) {
            meeting.setStatus(finished);
            if (meetingRepository.saveAndFlush(meeting) != null)
                return success;
            throw new BadRequestException(update);
        }
        throw new ForbiddenException(forbiddenNotAuthorized);
    }

    @RequestMapping(value = "/getByRoom/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<Meeting> getByRoom(@PathVariable Integer id) throws BadRequestException, ForbiddenException {
        if (id != null) {
            if (!userBean.getUser().getRoleId().equals(superAdmin)) {
                return meetingRepository.getAllByStatusInAndRoomIdAndCompanyId(new Byte[]{scheduled, finished}, id, userBean.getUser().getCompanyId());
            }
            throw new ForbiddenException(forbiddenNotAuthorized);
        }
        throw new BadRequestException(badRequest);
    }

    @RequestMapping(value = "/cancel/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String cancel(@PathVariable Integer id) throws BadRequestException, ForbiddenException {
        Meeting meeting = meetingRepository.findById(id).orElse(null);
        if (meeting!=null&&
                (userBean.getUser().getRoleId().equals(admin) || userBean.getUser().getId().equals(meeting.getUserId()))
                && meeting.getStatus().equals(scheduled)
                ) {
            Timestamp currentTime = new Timestamp(System.currentTimeMillis());
            Timestamp minimalCancelTime = new Timestamp(meeting.getStartTime().getTime() + settingsRepository.getByCompanyId(meeting.getCompanyId()).getCancelTime().getTime());
            if (currentTime.before(minimalCancelTime) && Validator.timestampCompare(currentTime,minimalCancelTime)!=null
                    && Validator.timestampCompare(currentTime,minimalCancelTime)==-1) {
                //if(meeting.getCancelationReason() != null && Validator.stringMaxLength(meeting.getCancelationReason(),500)
                //        && Validator.stringMaxLength(meeting.getTopic(),500)) {

                // notify participants
                List<String> emails = meetingRepository.getEmailsForMeeting(id);
                for(String s : emails)
                    Notification.notify(s.trim(), "Meeting canceled");

                return updateStatus(meeting, canceled);
                //}
                //throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}","topic-a").replace("{broj}",String.valueOf(500)));
            }
            throw new BadRequestException(badRequestMinimalCancelTime);
        }
        throw new ForbiddenException(forbiddenNotAuthorized);
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String update(@PathVariable Integer id, @RequestBody Meeting meeting) throws BadRequestException, ForbiddenException {
        Meeting oldMeeting = cloner.deepClone(meetingRepository.findById(id).orElse(null));
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        if (oldMeeting == null) {
            throw new BadRequestException(noMeeting);
        }
        if (oldMeeting.getUserId().equals(meeting.getUserId()) && (userBean.getUser().getRoleId().equals(admin) || oldMeeting.getUserId().equals(userBean.getUser().getId()))) {
            if(!oldMeeting.getStartTime().equals(meeting.getStartTime())){
                if(Validator.timestampCompare(meeting.getStartTime(),currentTime) != null && Validator.timestampCompare(meeting.getStartTime(), currentTime) <0){
                    throw new BadRequestException(badRequestDateTimeCompare.replace("{date1}","vrijeme pocetka")
                            .replace("{prijePoslije}","poslije").replace("{date2}","trenutnog vremena"));
                }
            }
            if(!oldMeeting.getEndTime().equals(meeting.getEndTime())){
                if(Validator.timestampCompare(meeting.getEndTime(),currentTime) != null && Validator.timestampCompare(meeting.getEndTime(), currentTime) <0){
                    throw new BadRequestException(badRequestDateTimeCompare.replace("{date1}","vrijeme zavrsetka")
                            .replace("{prijePoslije}","poslije").replace("{date2}","trenutnog vremena"));
                }
            }
            if (checkMeeting(meeting, false)) {
                    meetingRepository.saveAndFlush(meeting);
                    logUpdateAction(meeting, oldMeeting);
                    return success;
            }
        }
        throw new ForbiddenException(forbiddenNotAuthorized);
    }


    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws ForbiddenException {
        throw new ForbiddenException(badRequestDelete);
    }


    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    Meeting insert(@RequestBody Meeting meeting) throws BadRequestException, ForbiddenException {
        if (userBean.getUser().getRoleId().equals(admin) || userBean.getUser().getRoleId().equals(advancedUser)) {
            if (meeting != null && meeting.getCompanyId() != null && userBean.getUser().getCompanyId().equals(meeting.getCompanyId())) {
                if (checkMeeting(meeting, true)) {
                    if ((meeting = meetingRepository.saveAndFlush(meeting)) != null) {
                        Participant creator = new Participant();
                        creator.setMeetingId(meeting.getId());
                        creator.setUserId(meeting.getUserId());
                        creator.setCompanyId(meeting.getCompanyId());
                        creator.setDeleted((byte) 0);
                        if (participantRepository.saveAndFlush(creator) != null) {
                            return meeting;
                        }
                        throw new BadRequestException(badRequest);
                    }
                }
            }
            throw new BadRequestException(badRequestMeetingCompanyMismatch);
        }
        throw new ForbiddenException(forbiddenNotAuthorized);
    }

    private Boolean checkMeeting(Meeting meeting, Boolean insert) throws BadRequestException {
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        if (meeting != null
                && meeting.getEndTime() != null
                && meeting.getStartTime() != null
                && meeting.getUserId() != null
                && meeting.getRoomId() != null
                && meeting.getCompanyId() != null
                && meeting.getStatus() != null
                && meeting.getTopic() != null) {
            if (Validator.timestampCompare(meeting.getStartTime(), meeting.getEndTime()) != null && Validator.timestampCompare(meeting.getStartTime(), meeting.getEndTime()) <= 0) {
                if (Validator.stringMaxLength(meeting.getTopic(), 500)) {
                    if(meeting.getDescription()!=null && !Validator.stringMaxLength(meeting.getDescription(),500)){
                        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}","description-a").replace("{broj}",String.valueOf(500)));
                    }
                    if(meeting.getStatus().equals(canceled) && meeting.getCancelationReason()!=null && !Validator.stringMaxLength(meeting.getCancelationReason(),500)){
                        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}","cancelation reason-a").replace("{broj}",String.valueOf(500)));
                    }
                    List<Integer> ids = meetingRepository.getIdsOfMeetingsBetween(meeting.getStartTime(), meeting.getEndTime(), meeting.getRoomId());
                    if (insert ){
                        if(Validator.timestampCompare(meeting.getStartTime(),currentTime) != null && Validator.timestampCompare(meeting.getStartTime(), currentTime) <0){
                             throw new BadRequestException(badRequestDateTimeCompare.replace("{date1}","vrijeme pocetka")
                                    .replace("{prijePoslije}","poslije").replace("{date2}","trenutnog vremena"));
                        }
                        if(Validator.timestampCompare(meeting.getEndTime(),currentTime) != null && Validator.timestampCompare(meeting.getEndTime(), currentTime) < 0) {
                            throw new BadRequestException(badRequestDateTimeCompare.replace("{date1}","vrijeme zavrsetka")
                                    .replace("{prijePoslije}","poslije").replace("{date2}","trenutnog vremena"));
                        }
                        if(ids.size() == 0){
                            return true;
                        }
                        throw new BadRequestException(badRequestMeetingPeriodViolation);
                    } else {
                        if(meeting.getId() != null && ((ids.size() == 1 && ids.get(0).equals(meeting.getId())) || ids.size()==0)){
                            return true;
                        }
                        throw new BadRequestException(badRequestMeetingPeriodViolation);
                    }
                }
                throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}","topic-a").replace("{broj}",String.valueOf(500)));
            }
            throw new BadRequestException(badRequestDateTimeCompare.replace("{date1}","datum pocetka")
                    .replace("{prijePoslije}","prije").replace("{date2}","datuma kraja"));
        }
        throw new BadRequestException(badRequest);
    }

    @SuppressWarnings("SameReturnValue")
    private String updateStatus(Meeting updatedObject, byte status) throws BadRequestException, ForbiddenException {
        if (status > 2) {
            throw new BadRequestException(badRequestStatus);
        }
        Meeting oldMeeting = cloner.deepClone(meetingRepository.findById(updatedObject.getId()).orElse(null));
        if (oldMeeting == null) {
            throw new BadRequestException(noMeeting);
        } else {
            if (oldMeeting.getUserId().equals(userBean.getUser().getId())) {
                Objects.requireNonNull(updatedObject).setStatus(status);
                if (checkMeeting(updatedObject, false)) {
                    meetingRepository.saveAndFlush(updatedObject);
                    logUpdateAction(updatedObject, oldMeeting);
                    return success;
                }
            }
            throw new ForbiddenException(forbiddenNotAuthorized);
        }
    }

    @RequestMapping(value = "/full/{id}", method = RequestMethod.GET)
    public @ResponseBody
    MeetingDocumentParticipant getFullMeeting(@PathVariable Integer id) throws BadRequestException {
        MeetingDocumentParticipant meetingDocumentParticipant = new MeetingDocumentParticipant();
        Meeting meeting = meetingRepository.getOne(id);
        if(meeting != null && meeting.getCompanyId().equals(userBean.getUser().getCompanyId())){
            List<Document> documents = documentRepository.getAllByMeetingId(id);
            List<Participant> participants = participantRepository.getAllByMeetingIdAndDeletedIs(id, (byte)0);

            meetingDocumentParticipant.setMeeting(meeting);
            meetingDocumentParticipant.setDocuments(documents);
            meetingDocumentParticipant.setParticipants(participants);

            return meetingDocumentParticipant;
        }
        throw new BadRequestException(badRequestMeetingNotExist);
    }

    @Transactional
    @RequestMapping(value = "/full", method = RequestMethod.POST)
    public @ResponseBody
    MeetingDocumentParticipant insertFullMeeting(@RequestBody MeetingDocumentParticipant meeting) throws BadRequestException, ForbiddenException {
        meeting.setMeeting(insert(meeting.getMeeting()));
        meeting.getParticipants().forEach(participant -> participant.setMeetingId(meeting.getMeeting().getId()));
        meeting.getDocuments().forEach(document -> document.setMeetingId(meeting.getMeeting().getId()));
        meeting.setParticipants(participantRepository.saveAll(meeting.getParticipants()));
        meeting.getMeeting().setParticipantsNumber(meetingRepository.getParticipantsNumberByMeetingId(meeting.getMeeting().getId()));
        meeting.setDocuments(documentRepository.saveAll(meeting.getDocuments()));

        // notify participants
        List<String> emails = meetingRepository.getEmailsForMeeting(meeting.getMeeting().getId());
        for(String s : emails)
            Notification.notify(s.trim(), "New meeting");

        return meeting;

    }
    @Transactional
    @RequestMapping(value = "/full/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    MeetingDocumentParticipant updateFullMeeting(@PathVariable Integer id,@RequestBody MeetingDocumentParticipant meeting) throws BadRequestException, ForbiddenException {
        meeting.getParticipants().forEach(participant -> participant.setMeetingId(id));
        meeting.setParticipants(participantRepository.saveAll(meeting.getParticipants()));
        List<Document> documents = meeting.getDocuments();
        List<Document> currentDocuments = documentRepository.getAllByMeetingId(id);
        for (Iterator<Document> it = currentDocuments.iterator(); it.hasNext(); ) {
            Document document = it.next();
            if (!documents.contains(document)) {
                documentRepository.delete(document);
                it.remove();
            }
        }
        documents.removeAll(currentDocuments);
        documents.forEach(document -> document.setMeetingId(id));
        documents = documentRepository.saveAll(documents);
        documents.addAll(currentDocuments);
        meeting.setDocuments(documents);
        meeting.getMeeting().setParticipantsNumber(meetingRepository.getParticipantsNumberByMeetingId(meeting.getMeeting().getId()));
        update(id,meeting.getMeeting());
        return meeting;
    }

    @RequestMapping(value = "/getEmailsByMeetingId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<String> getAllByNameContains(@PathVariable Integer id) {
        return meetingRepository.getEmailsForMeeting(id);

    }

}
