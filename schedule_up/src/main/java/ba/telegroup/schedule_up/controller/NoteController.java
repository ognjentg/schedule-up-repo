package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Note;
import ba.telegroup.schedule_up.model.modelCustom.NoteUser;
import ba.telegroup.schedule_up.repository.NoteRepository;
import ba.telegroup.schedule_up.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@RequestMapping(value = "/note")
@Controller
@Scope("request")
public class NoteController extends GenericController<Note, Integer> {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public NoteController(NoteRepository repo, UserRepository userRepository) {
        super(repo);
        this.noteRepository = repo;
        this.userRepository = userRepository;
    }

    /*
    Vraca sve custom NoteUser objekte
     */
    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll() {
        return noteRepository.getAllExtended(userBean.getUser().getCompanyId());
    }

    /*
    Vraca custom NoteUser objekat sa id-em
     */
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.GET)
    public @ResponseBody
    NoteUser findById(@PathVariable Integer id) {
        return noteRepository.getAllExtendedById(userBean.getUser().getCompanyId(), id);
    }

    /*
    Vraca sve custom NoteUser objekte gdje id predstavlja id User-a
     */
    @RequestMapping(value = "/getAllByUserId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<NoteUser> getAllByUserId(@PathVariable Integer id) {
        return noteRepository.getAllExtendedByUserId(userBean.getUser().getCompanyId(), id);

    }

    /*
    Vraca sve custom NoteUser objekte cije ime sadrzi name
     */
    @RequestMapping(value = "/getAllByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByNameContains(@PathVariable String name) {
        return noteRepository.getAllExtendedByNameContains(userBean.getUser().getCompanyId(), name);

    }

    /*
    Vrsi insert Note objekta a vraca odgovarajuci custom NoteUser objekat
     */
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public @ResponseBody
    NoteUser insert(@RequestBody Note note) {
        repo.saveAndFlush(note);
        logCreateAction(note);
        entityManager.refresh(note);
        String username = userRepository.getById(note.getUserId()).getUsername();

        NoteUser noteUser = new NoteUser();
        noteUser.setId(note.getId());
        noteUser.setName(note.getName());
        noteUser.setDescription(note.getDescription());
        noteUser.setPublishTime(note.getPublishTime());
        noteUser.setDeleted(note.getDeleted());
        noteUser.setUserId(note.getUserId());
        noteUser.setCompanyId(note.getCompanyId());
        noteUser.setUsername(username);

        return noteUser;
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        Note note = repo.findById(id).orElse(null);
        if (note != null) {
            note.setDeleted((byte) 1);
            repo.saveAndFlush(note);
            logDeleteAction(note);
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
