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
import java.util.Date;
import java.util.List;

@RequestMapping(value = "/meeting")
@Controller
@Scope("request")
public class MeetingController extends GenericController<Meeting,Integer>{
    MeetingRepository meetingRepository;
    @Value("${admin.name}")
    private String admin;
    @Value("${advancedUser.name}")
    private String advancedUser;
    @Value("${user.name")
    private String user;
    @Autowired
    public MeetingController(MeetingRepository repo)
    {
        super(repo);
        this.meetingRepository =repo;}

    /**
     * Ova metoda vraca sve rezervacije na osnovu privilegija ukoliko je u pitanju admin on moze da vidi sve kreirane rezervacije
     * dok se u slucaju da je u pitanju napredni korisnik ili obicni korisnik prikazuju rezervacije u kojima je on ucesnik
     */
    @Override
    public @ResponseBody
    List<Meeting> getAll() throws ForbiddenException {
        if(userBean.getUser().getRoleId().equals(meetingRepository.getRoleIdByName(admin))) {
            System.out.println("ADMIN");
            return meetingRepository.getAllByStatus((byte) 0);
        }else if(userBean.getUser().getRoleId().equals(meetingRepository.getRoleIdByName(advancedUser)) || userBean.getUser().getRoleId().equals(meetingRepository.getRoleIdByName(user))){
            return meetingRepository.getAllByParticipant(userBean.getUser().getId());
        }
        throw new ForbiddenException("Forbidden action");
    }

    /**
     * Ova metoda sluzi za zatvaranje sastanka
     */
    @RequestMapping(value = "/finish/",method = RequestMethod.PUT)
    public @ResponseBody
    String finish(@RequestBody Meeting meeting) throws BadRequestException,ForbiddenException {
       return  updateStatus(meeting,(byte)1);
    }

    /**
     * Ova metoda sluzi za otkazivanje sastanka - ostaje sporno da se vidi koji je onaj predefinisani period
     */
    @RequestMapping(value = "/cancel/",method = RequestMethod.PUT)
    public @ResponseBody
    String cancel(@RequestBody Meeting meeting) throws BadRequestException,ForbiddenException {
        Timestamp currentTime=new Timestamp(System.currentTimeMillis());
        Timestamp minimalCancelTime=new Timestamp(meeting.getStartTime().getTime()+meetingRepository.getCancelTimeByCompanyId(userBean.getUser().getCompanyId()).getTime());
        if(currentTime.before(minimalCancelTime)) {
            return updateStatus(meeting, (byte) 2);
        }
        throw new BadRequestException("Bad request");
    }

    /**
     * metoda za azuriranje odnosno izmjenu rezervacije moguca je samo u slucaju da je radi onaj koju je i kreirao
     */
    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String update(@PathVariable Integer id, @RequestBody Meeting object) throws BadRequestException,ForbiddenException {
        Meeting oldObject = cloner.deepClone(meetingRepository.findById(id).orElse(null));
        if(oldObject!=null && object.getUserId()==null || oldObject.getUserId()==null || object.getCancelationReason()==null){
            throw new BadRequestException("user id cannot be null");
        }else {
            if(oldObject.getUserId().equals(object.getUserId()) && oldObject.getUserId().equals(userBean.getUser().getId())) {
                if (check(object, false)) {
                    if (meetingRepository.saveAndFlush(object) != null) {
                        logUpdateAction(object, oldObject);
                        return "Success";
                    }
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
        if(userBean.getUser().getRoleId().equals(meetingRepository.getRoleIdByName(admin)) || userBean.getUser().getRoleId().equals(meetingRepository.getRoleIdByName(advancedUser))) {
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
        if(meeting!=null
                && meeting.getEndTime()!=null
                && meeting.getStartTime()!=null
                && meeting.getEndTime().after(meeting.getStartTime())
                && meeting.getUserId()!=null
                && meeting.getRoomId()!=null
                && meeting.getCompanyId()!=null
                && meeting.getStatus()!=null
                && meeting.getTopic()!=null){
               List<Integer> ids=meetingRepository.getIdsOfMeetingsBetween(meeting.getStartTime(),meeting.getEndTime(),meeting.getRoomId());
                    if(insert){
                        if(ids.size()>0) {
                            return false;
                        }
                        return true;
                    }else{
                        if(meeting.getId()!=null && ids.size()==1 && ids.get(0).equals(meeting.getId()))
                            return true;
                        return false;
                    }
        }
        return false;
    }

    /**
     * pomocna metoda za azuranje statusa napravaljena zbog dupliciranja koda
     */
    private String updateStatus(Meeting updatedObject,byte status) throws BadRequestException, ForbiddenException {
        if(status>2){
            throw new BadRequestException("Bad request");
        }
        Meeting oldObject = cloner.deepClone(meetingRepository.findById(updatedObject.getId()).orElse(null));
        if (oldObject!=null && oldObject.getUserId() == null || oldObject.getUserId() == null) {
            throw new BadRequestException("user id cannot be null");
        } else {
            if (oldObject.getUserId().equals(userBean.getUser().getId())) {
                updatedObject.setStatus(status);
                if (check(updatedObject, false)) {
                    if (meetingRepository.saveAndFlush(updatedObject) != null) {
                        logUpdateAction(updatedObject, oldObject);
                        return "Success";
                    }
                }
                throw new BadRequestException("Bad request");
            }
            throw new ForbiddenException("Forbidden action");
        }
    }
}
