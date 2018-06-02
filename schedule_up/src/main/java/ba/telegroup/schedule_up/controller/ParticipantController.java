package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Participant;
import ba.telegroup.schedule_up.repository.ParticipantRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;

@RequestMapping(value = "/participant")
@Controller
@Scope("request")
public class ParticipantController extends GenericController<Participant,Integer> {
    public ParticipantController(JpaRepository<Participant, Integer> repo) {
        super(repo);
    }
    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        Participant participant=repo.findById(id).orElse(null);
        participant.setDeleted((byte)1);
        if (repo.saveAndFlush(participant) != null) {
            logDeleteAction(participant);
            return "Success";
        }
            throw new BadRequestException("Bad request");
    }
    @RequestMapping(value = {"/getAllByMeeting/{id}"},method = RequestMethod.GET)
    public @ResponseBody
    List<Participant> getAllByMeetingId(@PathVariable Integer id){
        return ((ParticipantRepository) repo).getAllByMeetingIdAndDeletedIs(id,(byte)0);
    }
    @RequestMapping(value = {"/getAllByUserGroup/{id}"},method = RequestMethod.GET)
    public @ResponseBody
    List<Participant> getAllByUserGroupId(@PathVariable Integer id){
        return ((ParticipantRepository) repo).getAllByUserGroupIdAndDeletedIs(id,(byte)0);
    }

    @RequestMapping(value = {"/getAllByUser/{id}"},method = RequestMethod.GET)
    public @ResponseBody
    List<Participant> getAllByUserId(@PathVariable Integer id){
        return ((ParticipantRepository) repo).getAllByUserIdAndDeletedIs(id,(byte)0);
    }

    @RequestMapping(value = {"/getAllByEmail/{email}"},method = RequestMethod.GET)
    public @ResponseBody
    List<Participant> getAllByEmail(@PathVariable String email){
        return ((ParticipantRepository) repo).getAllByEmailAndDeletedIs(email,(byte)0);
    }


}
