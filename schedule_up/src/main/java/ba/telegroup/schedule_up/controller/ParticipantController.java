package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Meeting;
import ba.telegroup.schedule_up.model.Participant;
import ba.telegroup.schedule_up.repository.MeetingRepository;
import ba.telegroup.schedule_up.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RequestMapping(value = "/participant")
@Controller
@Scope("request")
public class ParticipantController extends GenericController<Participant, Integer> {
    private final ParticipantRepository participantRepository;
    private final MeetingRepository meetingRepository;
    @Value("${status.deleted.true}")
    private Byte deleted;
    @Value("${status.deleted.false}")
    private Byte notDeleted;
    @Value("${admin.id}")
    private Integer admin;
    @Value("${advancedUser.id}")
    private Integer advancedUser;
    @Value("${user.id}")
    private Integer user;

    @Autowired
    public ParticipantController(ParticipantRepository participantRepository, MeetingRepository meetingRepository) {
        super(participantRepository);
        this.participantRepository = participantRepository;
        this.meetingRepository = meetingRepository;
    }

    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    Participant insert(@RequestBody Participant object) throws BadRequestException, ForbiddenException {
        if (object.getMeetingId() != null) {
            Meeting meeting = meetingRepository.findById(object.getMeetingId()).orElse(null);
            if (checkPermissions() && meeting != null && meeting.getUserId().equals(userBean.getUser().getId())) {
                List<Participant> participants = participantRepository.getAllByMeetingIdAndDeletedIs(meeting.getId(), notDeleted);
                if (participants.stream().filter(participant -> participant.equalsIgnorePrimaryKey(object)).count() == 0)
                    return super.insert(object);
                throw new BadRequestException("Bad request");
            }
            throw new ForbiddenException("Forbidden action");
        }
        throw new BadRequestException("Bad request");
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws ForbiddenException, BadRequestException {
        if (checkPermissions()) {
            Participant participant = participantRepository.findById(id).orElse(null);
            if (participant != null) {
                Meeting meeting = meetingRepository.findById(participant.getMeetingId()).orElse(null);
                if (meeting != null && meeting.getUserId().equals(userBean.getUser().getId())) {
                    Objects.requireNonNull(participant).setDeleted(deleted);
                    participantRepository.saveAndFlush(participant);
                    logDeleteAction(participant);
                    return "Success";
                }
            }
            throw new BadRequestException("Bad request");
        }
        throw new ForbiddenException("Forbidden action");
    }

    @RequestMapping(value = {"/getAllByMeeting/{id}"}, method = RequestMethod.GET)
    public @ResponseBody
    List<Participant> getAllByMeetingId(@PathVariable Integer id) throws ForbiddenException {
        if (checkPermissions()) {
            return participantRepository.getAllByMeetingIdAndDeletedIs(id, notDeleted);
        }
        throw new ForbiddenException("Forbidden action");
    }

    @RequestMapping(value = {"/getAllByCompany/{id}"}, method = RequestMethod.GET)
    public @ResponseBody
    List<Participant> getAllByCompanyId(@PathVariable Integer id) throws ForbiddenException {
        if (checkPermissions()) {
            return participantRepository.getAllByCompanyIdAndDeletedIs(id, notDeleted);
        }
        throw new ForbiddenException("Forbidden action");
    }

    @RequestMapping(value = {"/getAllByUserGroup/{id}"}, method = RequestMethod.GET)
    public @ResponseBody
    List<Participant> getAllByUserGroupId(@PathVariable Integer id) throws ForbiddenException {
        if (checkPermissions()) {
            return participantRepository.getAllByUserGroupIdAndDeletedIs(id, notDeleted);
        }
        throw new ForbiddenException("Forbidden action");
    }

    @RequestMapping(value = {"/getAllByUser/{id}"}, method = RequestMethod.GET)
    public @ResponseBody
    List<Participant> getAllByUserId(@PathVariable Integer id) throws ForbiddenException {
        if (checkPermissions()) {
            return participantRepository.getAllByUserIdAndDeletedIs(id, notDeleted);
        }
        throw new ForbiddenException("Forbidden action");
    }

    @RequestMapping(value = {"/getAllByEmail/{email}"}, method = RequestMethod.GET)
    public @ResponseBody
    List<Participant> getAllByEmail(@PathVariable String email) throws ForbiddenException {
        if (checkPermissions()) {
            return participantRepository.getAllByEmailAndDeletedIs(email, notDeleted);
        }
        throw new ForbiddenException("Forbidden action");
    }

    private boolean checkPermissions() {
        return userBean.getUser().getRoleId().equals(admin) || userBean.getUser().getRoleId().equals(advancedUser);
    }

    @Override
    public String update(Integer integer, Participant object) throws ForbiddenException {
        throw new ForbiddenException("Forbidden exception");
    }

    @Transactional
    @RequestMapping(value = {"/insertAll"}, method = RequestMethod.POST)
    public @ResponseBody
    List<Participant> insertAll(@RequestBody List<Participant> participants) throws BadRequestException, ForbiddenException {
        List<Participant> insertedParticipants = new ArrayList<>();
        if (participants != null) {
            for (Participant participant : participants) {
                insertedParticipants.add(insert(participant));
            }
            return insertedParticipants;
        }
        throw new BadRequestException("Bad request");
    }


}
