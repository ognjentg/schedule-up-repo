package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Meeting;
import ba.telegroup.schedule_up.repository.MeetingRepository;
import ba.telegroup.schedule_up.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

@RequestMapping(value = "/meeting")
@Controller
@Scope("request")
public class MeetingController extends GenericController<Meeting, Integer> {
    private final MeetingRepository meetingRepository;
    private final SettingsRepository settingsRepository;
    @Value("${admin.id}")
    private Integer admin;
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

    @Autowired
    public MeetingController(MeetingRepository meetingRepository, SettingsRepository settingsRepository) {
        super(meetingRepository);
        this.meetingRepository = meetingRepository;
        this.settingsRepository=settingsRepository;
    }

    @Override
    public @ResponseBody
    List<Meeting> getAll() throws ForbiddenException {
        if (userBean.getUser().getRoleId().equals(admin)) {
            return meetingRepository.getAllByStatusAndCompanyId(scheduled, userBean.getUser().getCompanyId());
        } else if (userBean.getUser().getRoleId().equals(advancedUser) || userBean.getUser().getRoleId().equals(user)) {
            return meetingRepository.getAllByParticipant(userBean.getUser().getId());
        }
        throw new ForbiddenException("Forbidden action");
    }

    @RequestMapping(value = "/finish/", method = RequestMethod.PUT)
    public @ResponseBody
    String finish(@RequestBody Meeting meeting) throws BadRequestException, ForbiddenException {
        if (userBean.getUser().getId().equals(meeting.getUserId())) {
            return updateStatus(meeting, finished);
        }
        throw new ForbiddenException("Forbidden action");
    }

    @RequestMapping(value = "/cancel/", method = RequestMethod.PUT)
    public @ResponseBody
    String cancel(@RequestBody Meeting meeting) throws BadRequestException, ForbiddenException {
        Meeting dbMeeting=meetingRepository.findById(meeting.getId()).orElse(null);
        if (userBean.getUser().getId().equals(meeting.getUserId())
                && dbMeeting!=null
                && dbMeeting.getStartTime()!=null
                && dbMeeting.getEndTime()!=null
                && dbMeeting.getStartTime().equals(meeting.getStartTime())
                && dbMeeting.getEndTime().equals(meeting.getEndTime())
                && dbMeeting.getStatus().equals(meeting.getStatus())
                && meeting.getStatus().equals(scheduled)
                && meeting.getUserId().equals(dbMeeting.getUserId())) {
            Timestamp currentTime=new Timestamp(System.currentTimeMillis());
            Timestamp minimalCancelTime=new Timestamp(meeting.getStartTime().getTime()+ settingsRepository.getByCompanyId(meeting.getCompanyId()).getCancelTime().getTime());
            if(meeting.getCancelationReason()!=null && currentTime.before(minimalCancelTime))
             return updateStatus(meeting, canceled);
            throw new BadRequestException("Bad request");
        }
        throw new ForbiddenException("Forbidden action");
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String update(@PathVariable Integer id, @RequestBody Meeting object) throws BadRequestException, ForbiddenException {
        Meeting oldObject = cloner.deepClone(meetingRepository.findById(id).orElse(null));
        if (oldObject != null && object.getUserId() == null || Objects.requireNonNull(oldObject).getUserId() == null ) {
            throw new BadRequestException("user id cannot be null");
        } else {
            if (oldObject.getUserId().equals(object.getUserId()) && oldObject.getUserId().equals(userBean.getUser().getId())) {
                if (check(object, false)) {
                    meetingRepository.saveAndFlush(object);
                    logUpdateAction(object, oldObject);
                    return "Success";
                }
                throw new BadRequestException("Bad request");
            }
            throw new ForbiddenException("Forbidden action");
        }
    }


    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws ForbiddenException {
        throw new ForbiddenException("Forbidden action");
    }


    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    Meeting insert(@RequestBody Meeting object) throws BadRequestException, ForbiddenException {
        if (userBean.getUser().getRoleId().equals(admin) || userBean.getUser().getRoleId().equals(advancedUser)) {
            if (object != null && object.getCompanyId() != null && userBean.getUser().getCompanyId().equals(object.getCompanyId())) {
                if (check(object, true)) {
                    return super.insert(object);
                }
                throw new BadRequestException("Bad request");
            }
        }
        throw new ForbiddenException("Forbidden action");
    }

    private Boolean check(Meeting meeting, Boolean insert) {
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        if (meeting != null
                && meeting.getEndTime() != null
                && meeting.getStartTime() != null
                && meeting.getEndTime().after(meeting.getStartTime())
                && meeting.getUserId() != null
                && meeting.getRoomId() != null
                && meeting.getCompanyId() != null
                && meeting.getStatus() != null
                && meeting.getTopic() != null) {
            List<Integer> ids = meetingRepository.getIdsOfMeetingsBetween(meeting.getStartTime(), meeting.getEndTime(), meeting.getRoomId());
            if (insert && meeting.getStartTime().after(currentTime)
                    && meeting.getEndTime().after(currentTime)) {
                return ids.size() <= 0;
            } else {
                return meeting.getId() != null && ids.size() == 1 && ids.get(0).equals(meeting.getId());
            }
        }
        return false;
    }

    @SuppressWarnings("SameReturnValue")
    private String updateStatus(Meeting updatedObject, byte status) throws BadRequestException, ForbiddenException {
        if (status > 2) {
            throw new BadRequestException("Bad request");
        }
        Meeting oldObject = cloner.deepClone(meetingRepository.findById(updatedObject.getId()).orElse(null));
        if (oldObject != null && oldObject.getUserId() == null || Objects.requireNonNull(oldObject).getUserId() == null) {
            throw new BadRequestException("user id cannot be null");
        } else {
            if (oldObject.getUserId().equals(userBean.getUser().getId())) {
                Objects.requireNonNull(updatedObject).setStatus(status);
                if (check(updatedObject, false)) {
                    meetingRepository.saveAndFlush(updatedObject);
                    logUpdateAction(updatedObject, oldObject);
                    return "Success";
                }
                throw new BadRequestException("Bad request");
            }
            throw new ForbiddenException("Forbidden action");
        }
    }
}
