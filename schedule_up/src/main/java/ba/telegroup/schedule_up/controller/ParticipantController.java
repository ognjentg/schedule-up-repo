package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
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
        Participant participant=((ParticipantRepository) repo).findById(id).orElse(null);
        participant.setDeleted((byte)1);
        if (((ParticipantRepository) repo).saveAndFlush(participant) != null) {
            logDeleteAction(participant);
            return "Success";
        }
        else {
            throw new BadRequestException("Bad request");
        }
    }
    @RequestMapping(value = {"/getAllByMeetingId/{id}"},method = RequestMethod.GET)
    public @ResponseBody
    List<Participant> getAllByMeetingId(@PathVariable Integer id){
        return ((ParticipantRepository) repo).getAllByMeetingIdAndDeletedIs(id,(byte)0);
    }

    @Override
    public List<Participant> getAll() throws BadRequestException, ForbiddenException {
        throw new ForbiddenException("Forbidden action");
    }

}
