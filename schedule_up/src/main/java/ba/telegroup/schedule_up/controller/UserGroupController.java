package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Participant;
import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.model.UserGroup;
import ba.telegroup.schedule_up.repository.ParticipantRepository;
import ba.telegroup.schedule_up.repository.UserGroupRepository;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequestMapping(value = "/user-group")
@Controller
@Scope("request")
public class UserGroupController extends GenericController<UserGroup, Integer> {
    private final UserGroupRepository usergroupRepository;
    private final ParticipantRepository participantRepository;


    @Value("${badRequest.delete}")
    private String badRequestDelete;

    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;


    @Autowired
    public UserGroupController(UserGroupRepository repo,ParticipantRepository participantRepository) {
        super(repo);
        this.usergroupRepository = repo;
        this.participantRepository=participantRepository;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<UserGroup> getAll() {
        return usergroupRepository.getAllByCompanyIdAndDeletedEquals(userBean.getUser().getCompanyId(), (byte) 0);
    }


    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        UserGroup userGroup = repo.findById(id).orElse(null);
        if (userGroup != null) {
            Objects.requireNonNull(userGroup).setDeleted((byte) 1);
            repo.saveAndFlush(userGroup);
            logDeleteAction(userGroup);
            return "Success";
        }
        throw new BadRequestException(badRequestDelete);
    }

    @Override
    @Transactional
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String update(@PathVariable Integer id, @RequestBody UserGroup object) throws BadRequestException, ForbiddenException {
        if(Validator.stringMaxLength(object.getName(), 100))
        {
            return super.update(id, object);
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
    }

    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    UserGroup insert(@RequestBody UserGroup object) throws BadRequestException, ForbiddenException {
        if(Validator.stringMaxLength(object.getName(), 100))
        {
            return super.insert(object);
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
    }

    @Transactional
    @RequestMapping(value = {"/nonParticipantsFor/{meetingId}"}, method = RequestMethod.GET)
    public @ResponseBody
    List<UserGroup> getNonParticipants(@PathVariable Integer meetingId) {
        List<UserGroup> retValue = getAll();
        retValue.removeAll(usergroupRepository.findAllById(participantRepository.getAllByMeetingIdAndDeletedIs(meetingId, (byte) 0).stream().map(Participant::getUserGroupId).collect(Collectors.toList())));
        return retValue;
    }
}
