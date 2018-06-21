package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Meeting;
import ba.telegroup.schedule_up.repository.MeetingRepository;
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
public class MeetingController extends GenericController<Meeting,Integer>{
    MeetingRepository meetingRepository;
    @Value("${admin.id}")
    private Integer admin;
    @Value("${advancedUser.id}")
    private Integer advancedUser;
    @Value("${user.id}")
    private Integer user;
    @Autowired
    public MeetingController(MeetingRepository repo) {
        super(repo);
        this.meetingRepository = repo;
    }

    /**
     * Ova metoda vraca sve rezervacije na osnovu privilegija ukoliko je u pitanju admin on moze da vidi sve kreirane rezervacije
     * dok se u slucaju da je u pitanju napredni korisnik ili obicni korisnik prikazuju rezervacije u kojima je on ucesnik
     */
    @Override
    public @ResponseBody
    List<Meeting> getAll() throws ForbiddenException {
        if(userBean.getUser().getRoleId().equals(admin)) {
            return meetingRepository.getAllByStatusAndCompanyId((byte) 0,userBean.getUser().getCompanyId());
        }else if(userBean.getUser().getRoleId().equals(advancedUser) || userBean.getUser().getRoleId().equals(user)){
            return meetingRepository.getAllByParticipant(userBean.getUser().getId());
        }
        throw new ForbiddenException("Forbidden action");
    }

    /**
     * Ova metoda sluzi za zatvaranje sastanka
     */
    @RequestMapping(value = "/finish/", method = RequestMethod.PUT)
    public @ResponseBody
    String finish(@RequestBody Meeting meeting) throws BadRequestException,ForbiddenException {
        if(userBean.getUser().getId().equals(meeting.getUserId()) ) {
            return updateStatus(meeting, (byte) 1);
        }
        throw new ForbiddenException("Forbidden action");
    }

    /**
     * Ova metoda sluzi za otkazivanje sastanka - ostaje sporno da se vidi koji je onaj predefinisani period
     */
    @RequestMapping(value = "/cancel/", method = RequestMethod.PUT)
    public @ResponseBody
    String cancel(@RequestBody Meeting meeting) throws BadRequestException,ForbiddenException {
        if(userBean.getUser().getId().equals(meeting.getUserId()) ) {
            Timestamp currentTime = new Timestamp(System.currentTimeMillis());
            Timestamp minimalCancelTime = new Timestamp(meeting.getStartTime().getTime() + meetingRepository.getCancelTimeByCompanyId(userBean.getUser().getCompanyId()).getTime());
            if (currentTime.before(minimalCancelTime)) {
                if(meeting.getCancelationReason()!=null) {
                    return updateStatus(meeting, (byte) 2);
                }
                throw new BadRequestException("Bad request");
            }
        }
        throw new ForbiddenException("Forbidden action");
    }

    /**
     * metoda za azuriranje odnosno izmjenu rezervacije moguca je samo u slucaju da je radi onaj koju je i kreirao
     */
    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String update(@PathVariable Integer id, @RequestBody Meeting object) throws BadRequestException, ForbiddenException {
        Meeting oldObject = cloner.deepClone(meetingRepository.findById(id).orElse(null));
        if (oldObject != null && object.getUserId() == null || Objects.requireNonNull(oldObject).getUserId() == null || object.getCancelationReason() == null) {
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

    /**
     * brisanje je nemoguce
     */
    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws ForbiddenException {
        throw new ForbiddenException("Forbidden action");
    }

    /**
     * kreiranje rezervacije u slucaju da smo ili admin ili napredni korisnik u suprotnom ide forbidden exception
     */
    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    Meeting insert(@RequestBody Meeting object) throws BadRequestException, ForbiddenException {
        if(userBean.getUser().getRoleId().equals(admin) || userBean.getUser().getRoleId().equals(advancedUser)) {
            if(check(object,true)) {
                return super.insert(object);
            }
            throw new BadRequestException("Bad request");
        }
        throw new ForbiddenException("Forbidden action");
    }

    /**
     * pomocna metoda za provjeru sastanka
     */
    private Boolean check(Meeting meeting, Boolean insert){
        Timestamp currentTime=new Timestamp(System.currentTimeMillis());
        if(meeting!=null
                && meeting.getEndTime()!=null
                && meeting.getStartTime()!=null
                && meeting.getStartTime().after(currentTime)
                && meeting.getEndTime().after(currentTime)
                && meeting.getEndTime().after(meeting.getStartTime())
                && meeting.getUserId() != null
                && meeting.getRoomId() != null
                && meeting.getCompanyId() != null
                && meeting.getStatus() != null
                && meeting.getTopic() != null) {
            List<Integer> ids = meetingRepository.getIdsOfMeetingsBetween(meeting.getStartTime(), meeting.getEndTime(), meeting.getRoomId());
            if (insert) {
                return ids.size() <= 0;
            } else {
                return meeting.getId() != null && ids.size() == 1 && ids.get(0).equals(meeting.getId());
            }
        }
        return false;
    }

    /**
     * pomocna metoda za azuranje statusa napravaljena zbog dupliciranja koda
     */
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
                updatedObject.setStatus(status);
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
