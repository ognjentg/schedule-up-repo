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
}
