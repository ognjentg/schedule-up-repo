package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Note;
import ba.telegroup.schedule_up.model.modelCustom.NoteUser;
import ba.telegroup.schedule_up.repository.NoteRepository;
import ba.telegroup.schedule_up.repository.UserRepository;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RequestMapping(value = "/note")
@Controller
@Scope("request")
public class NoteController extends GenericController<Note, Integer> {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Value("${badRequest.delete}")
    private String badRequestDelete;

    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;

    @Value("${badRequest.dateTimeCompare}")
    private String badRequestDateTimeCompare;

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
    NoteUser insert(@RequestBody Note note) throws BadRequestException {
        if (Validator.stringMaxLength(note.getName(), 100)) {
            if (Validator.stringMaxLength(note.getDescription(), 500)) {
                if(Validator.timestampCompare(new Timestamp(System.currentTimeMillis()),note.getExpiredTime())!=null &&
                        Validator.timestampCompare(new Timestamp(System.currentTimeMillis()),note.getExpiredTime())<=0){
                    if (repo.saveAndFlush(note) != null) {
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
                        noteUser.setExpiredTime(note.getExpiredTime());

                        return noteUser;
                    }
                    throw new BadRequestException(badRequestInsert);
                }
                throw new BadRequestException(badRequestDateTimeCompare.replace("{date1}", "Vrijeme isteka").replace("{prijePoslije}", "poslije").replace("{date2}", "vremena objavljivanja"));
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "opisa").replace("{broj}", String.valueOf(500)));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
    }

    @Transactional
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    @Override
    public @ResponseBody
    String update(@PathVariable Integer id, @RequestBody Note note) throws BadRequestException {
        if (Validator.stringMaxLength(note.getName(), 100)) {
            if (Validator.stringMaxLength(note.getDescription(), 500)) {
                if(Validator.timestampCompare(note.getPublishTime(),note.getExpiredTime())!=null &&
                        Validator.timestampCompare(note.getPublishTime(),note.getExpiredTime())<=0){
                    Note oldObject = cloner.deepClone(repo.findById(id).orElse(null));
                    if (repo.saveAndFlush(note) != null) {
                        logUpdateAction(note, oldObject);
                        return "Success";
                    }
                    throw new BadRequestException(badRequestUpdate);
                }
                throw new BadRequestException(badRequestDateTimeCompare.replace("{date1}", "Vrijeme isteka").replace("{prijePoslije}", "poslije").replace("{date2}", "vremena objavljivanja"));
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "opisa").replace("{broj}", String.valueOf(500)));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
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
        throw new BadRequestException(badRequestDelete);
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
