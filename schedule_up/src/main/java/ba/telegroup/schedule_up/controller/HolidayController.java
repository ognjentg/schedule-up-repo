package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Holiday;
import ba.telegroup.schedule_up.repository.HolidayRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@RequestMapping(value = "/holiday")
@Controller
@Scope("request")
public class HolidayController extends GenericController<Holiday, Integer> {
    public HolidayController(JpaRepository<Holiday, Integer> repo) {
        super(repo);
    }
    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<Holiday> getAll() {
        List<Holiday> holidays = ((HolidayRepository) repo).findAll();
        List<Holiday> retVal = new ArrayList<>();
        for (Holiday holiday : holidays) {
            if (holiday.getDeleted() != (byte) 1) {
                retVal.add(holiday);
            }
        }
        return retVal;
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        Holiday holiday = ((HolidayRepository) repo).findById(id).orElse(null);
        Holiday oldObject = cloner.deepClone(holiday);
        holiday.setDeleted((byte) 1);
        if (((HolidayRepository) repo).saveAndFlush(holiday) != null) {
            logUpdateAction(holiday, oldObject);
            return "Success";
        }
        throw new BadRequestException("Bad request");
    }

    @RequestMapping(value = "/getAllByCompanyId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCompanyId(@PathVariable Integer id) {
        List<Holiday> holidays = ((HolidayRepository) repo).getAllByCompanyId(id);
        List<Holiday> result = new ArrayList<>();
        for (Holiday n : holidays) {
            if(n.getDeleted()!=(byte)1){
                result.add(n);
            }
        }
        return result;
    }

    @RequestMapping(value = "/getAllByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByNameContains(@PathVariable String name) {
        List<Holiday> holidays = ((HolidayRepository) repo).getAllByNameContains(name);
        List<Holiday> result = new ArrayList<>();
        for (Holiday n : holidays) {
            if(n.getDeleted()!=(byte)1){
                result.add(n);
            }
        }
        return result;
    }

    @RequestMapping(value = "/getAllByDateAfter/{date}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByDateAfter(@PathVariable java.sql.Date date) {
        List<Holiday> holidays = ((HolidayRepository) repo).getAllByDateAfter(date);
        List<Holiday> result = new ArrayList<>();
        for (Holiday n : holidays) {
            if(n.getDeleted()!=(byte)1){
                result.add(n);
            }
        }
        return result;
    }

    @RequestMapping(value = "/getAllByDateBefore/{date}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByDateBefore(@PathVariable java.sql.Date date) {
        List<Holiday> holidays = ((HolidayRepository) repo).getAllByDateBefore(date);
        List<Holiday> result = new ArrayList<>();
        for (Holiday n : holidays) {
            if(n.getDeleted()!=(byte)1){
                result.add(n);
            }
        }
        return result;
    }

    @RequestMapping(value = "/getAllByDateBetween/{from}/{to}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByDateBetween(@PathVariable java.sql.Date from, @PathVariable java.sql.Date to) {
        List<Holiday> holidays = ((HolidayRepository) repo).getAllByDateBetween(from, to);
        List<Holiday> result = new ArrayList<>();
        for (Holiday n : holidays) {
            if(n.getDeleted()!=(byte)1){
                result.add(n);
            }
        }
        return result;
    }
}