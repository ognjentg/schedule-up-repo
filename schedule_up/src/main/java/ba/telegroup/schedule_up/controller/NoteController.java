package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Building;
import ba.telegroup.schedule_up.model.Note;
import ba.telegroup.schedule_up.model.modelCustom.NoteUser;
import ba.telegroup.schedule_up.repository.BuildingRepository;
import ba.telegroup.schedule_up.repository.NoteRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.NoteRepositoryCustom;
import ba.telegroup.schedule_up.session.UserBean;
import org.springframework.beans.factory.annotation.Autowired;
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

    /*
    Vraca sve custom NoteUser objekte
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public @ResponseBody
    List<NoteUser> getAllExtended() {
        return ((NoteRepositoryCustom) repo).getAllExtended(userBean.getUser().getCompanyId());
    }

    /*
    Vraca custom NoteUser objekat sa id-em
     */
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.GET)
    public @ResponseBody NoteUser findById(@PathVariable Integer id) {
        return ((NoteRepositoryCustom) repo).getAllExtendedById(userBean.getUser().getCompanyId(), id);
    }

    /*
    Vraca sve custom NoteUser objekte gdje id predstavlja id User-a
     */
    @RequestMapping(value = "/getAllByUserId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<NoteUser> getAllByUserId(@PathVariable Integer id) {
        return ((NoteRepositoryCustom) repo).getAllExtendedByUserId(userBean.getUser().getCompanyId(),id);

    }

    @RequestMapping(value = "/getAllByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByNameContains(@PathVariable String name) {
        return ((NoteRepositoryCustom) repo).getAllExtendedByNameContains(userBean.getUser().getCompanyId(),name);

    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody String delete(@PathVariable Integer id) throws BadRequestException {
        Note note=((NoteRepository) repo).findById(id).orElse(null);
       if (note!=null) {
           note.setDeleted((byte) 1);
           if (((NoteRepository) repo).saveAndFlush(note) != null) {
               logDeleteAction(note);
               return "Success";
           }
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
