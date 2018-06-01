package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Meeting;
import ba.telegroup.schedule_up.repository.MeetingRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value = "/meeting")
@Controller
@Scope("request")
public class MeetingController extends GenericController<Meeting,Integer>{
    public MeetingController(JpaRepository<Meeting,Integer> repo){super(repo);}

    /**
     * Ova metoda vraca sve rezervacije na osnovu privilegija ukoliko je u pitanju admin on moze da vidi sve kreirane rezervacije
     * dok se u slucaju da je u pitanju napredni korisnik ili obicni korisnik prikazuju rezervacije u kojima je on ucesnik
     * @return
     * @throws ForbiddenException
     */
    @Override
    @RequestMapping(value = "/",method = RequestMethod.GET)
    public @ResponseBody
    List<Meeting> getAll() throws ForbiddenException {
        if(Integer.valueOf(2).equals(userBean.getUser().getRoleId())) {
            return((MeetingRepository) repo).getAllByStatus((byte) 0);
        }else if(Integer.valueOf(3).equals(userBean.getUser().getRoleId()) || Integer.valueOf(4).equals(userBean.getUser().getRoleId())){
            return ((MeetingRepository)repo).getAllByParticipant(userBean.getUser().getId());
        }
        throw new ForbiddenException("Forbidden action");
    }

    /**
     * Ova metoda sluzi za zatvaranje sastanka
     * @param id
     * @return
     * @throws BadRequestException
     * @throws ForbiddenException
     */
    @RequestMapping(value = "/finish/{id}",method = RequestMethod.PUT)
    public @ResponseBody
    String finish(@PathVariable Integer id) throws BadRequestException,ForbiddenException {
       return  updateStatus(id,(byte)1);
    }

    /**
     * Ova metoda sluzi za otkazivanje sastanka - ostaje sporno da se vidi koji je onaj predefinisani period
     * @param id
     * @return
     * @throws BadRequestException
     * @throws ForbiddenException
     */
    @RequestMapping(value = "/cancel/{id}",method = RequestMethod.PUT)
    public @ResponseBody
    String cancel(@PathVariable Integer id) throws BadRequestException,ForbiddenException {
        return updateStatus(id,(byte)2);
    }

    /**
     * metoda za azuriranje odnosno izmjenu rezervacije moguca je samo u slucaju da je radi onaj koju je i kreirao
     * @param id
     * @param object
     * @return
     * @throws BadRequestException
     * @throws ForbiddenException
     */
    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String update(@PathVariable Integer id, @RequestBody Meeting object) throws BadRequestException,ForbiddenException {
        Meeting oldObject = cloner.deepClone(repo.findById(id).orElse(null));
        if(oldObject!=null && object.getUserId()==null || oldObject.getUserId()==null || object.getCancelationReason()==null){
            throw new BadRequestException("user id cannot be null");
        }else {
            if(oldObject.getUserId().equals(object.getUserId()) && oldObject.getUserId().equals(userBean.getUser().getId())) {
                if (check(object, false)) {
                    if (repo.saveAndFlush(object) != null) {
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
     * @param id
     * @return
     * @throws BadRequestException
     * @throws ForbiddenException
     */
    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException, ForbiddenException {
        throw new ForbiddenException("Forbidden action");
    }

    /**
     * kreiranje rezervacije u slucaju da smo ili admin ili napredni korisnik u suprotnom ide forbidden exception
     * @param object
     * @return
     * @throws BadRequestException
     * @throws ForbiddenException
     */
    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    Meeting insert(@RequestBody Meeting object) throws BadRequestException, ForbiddenException {
        if(Integer.valueOf(2).equals(userBean.getUser().getRoleId()) || Integer.valueOf(3).equals(userBean.getUser().getRoleId())) {
            if(check(object,true)) {
                return super.insert(object);
            }
            throw new BadRequestException("Bad request");
        }
        throw new ForbiddenException("Forbidden action");
    }

    /**
     * metoda za provjeru sastanka
     * @param meeting
     * @param insert
     * @return
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
               List<Integer> ids=((MeetingRepository)repo).getIdsOfMeetingsBetween(meeting.getStartTime(),meeting.getEndTime(),meeting.getRoomId());
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
     * @param id
     * @param status
     * @return
     * @throws BadRequestException
     * @throws ForbiddenException
     */
    private String updateStatus(Integer id,byte status) throws BadRequestException, ForbiddenException {
        if(status>2){
            throw new BadRequestException("Bad request");
        }
        Meeting oldObject = cloner.deepClone(repo.findById(id).orElse(null));
        Meeting updatedObject = repo.findById(id).orElse(null);
        if (oldObject!=null && oldObject.getUserId() == null || oldObject.getUserId() == null) {
            throw new BadRequestException("user id cannot be null");
        } else {
            if (oldObject.getUserId().equals(userBean.getUser().getId())) {
                updatedObject.setStatus(status);
                if (check(updatedObject, false)) {
                    if (repo.saveAndFlush(updatedObject) != null) {
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
