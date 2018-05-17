package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Building;
import ba.telegroup.schedule_up.model.Note;
import ba.telegroup.schedule_up.repository.BuildingRepository;
import ba.telegroup.schedule_up.repository.NoteRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@RequestMapping(value = "/note")
@Controller
@Scope("request")
public class NoteController extends GenericController<Note, Integer> {
    public NoteController(JpaRepository<Note, Integer> repo) {
        super(repo);
    }

    @RequestMapping(value = "/getAllByCompanyId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCompanyId(@PathVariable Integer id) {
        List<Note> notes = ((NoteRepository) repo).getAllByCompanyId(id);
        List<Note> result = new ArrayList<>();
        for (Note n : notes) {
            if(n.getDeleted()!=(byte)1){
                result.add(n);
            }
        }
        return result;
    }

    @RequestMapping(value = "/getAllByUserId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByUserId(@PathVariable Integer id) {
        List<Note> notes = ((NoteRepository) repo).getAllByUserId(id);
        List<Note> result = new ArrayList<>();
        for (Note n : notes) {
            if(n.getDeleted()!=(byte)1){
                result.add(n);
            }
        }
        return result;
    }

    @RequestMapping(value = "/getAllByCompanyIdAndUserId/{companyId}/{userId}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCompanyIdAndUserId(@PathVariable Integer companyId, @PathVariable Integer userId) {
        List<Note> notes = ((NoteRepository) repo).getAllByCompanyIdAndUserId(companyId, userId);
        List<Note> result = new ArrayList<>();
        for (Note n : notes) {
            if(n.getDeleted()!=(byte)1){
                result.add(n);
            }
        }
        return result;
    }

    @RequestMapping(value = "/getAllByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByNameContains(@PathVariable String name) {
        List<Note> notes = ((NoteRepository) repo).getAllByNameContains(name);
        List<Note> result = new ArrayList<>();
        for (Note n : notes) {
            if(n.getDeleted()!=(byte)1){
                result.add(n);
            }
        }
        return result;
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody String delete(@PathVariable Integer id) throws BadRequestException {
        Note note=((NoteRepository) repo).findById(id).orElse(null);
        Note oldObject = cloner.deepClone(note);
        note.setDeleted((byte)1);
        if (((NoteRepository) repo).saveAndFlush(note) != null) {
            logUpdateAction(note, oldObject);
            return "Success";
        }
        throw new BadRequestException("Bad request");
    }

//    @RequestMapping(value = "/getAllByPublishTimeAfter/{time}", method = RequestMethod.GET)
//    public @ResponseBody
//    List getAllByPublishTimeAfter(@PathVariable String time){
//        return ((NoteRepository) repo).getAllByPublishTimeAfter(Timestamp.valueOf(time));
//    }
//
//    @RequestMapping(value = "/getAllByPublishTimeBefore/{time}", method = RequestMethod.GET)
//    public @ResponseBody
//    List getAllByPublishTimeBefore(@PathVariable Timestamp time){
//        return ((NoteRepository) repo).getAllByPublishTimeBefore(time);
//    }
}
