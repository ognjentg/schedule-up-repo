package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Holiday;
import ba.telegroup.schedule_up.repository.HolidayRepository;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Calendar;
import java.util.List;
import java.util.Objects;

@RequestMapping(value = "/holiday")
@Controller
@Scope("request")
public class HolidayController extends GenericController<Holiday, Integer> {
    private HolidayRepository holidayRepository;

    @Value("${badRequest.noHoliday}")
    private String badRequestNoHoliday;
    @Value("${badRequest.alreadyDeleted}")
    private String badRequestAlreadyDeleted;
    @Value("${badRequest.badDate}")
    private String badRequestBadDate;

    @Autowired
    public HolidayController(HolidayRepository repo) {
        super(repo);
        this.holidayRepository = repo;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<Holiday> getAll() {
        /*return holidayRepository.getAllByDeletedEqualsAndCompanyId((byte) 0, userBean.getUser().getCompanyId());*/
        return getAllByDateAfter(new java.sql.Date(Calendar.getInstance().getTimeInMillis()));
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException, ForbiddenException{
        Holiday holiday = holidayRepository.findById(id).orElse(null);
        if(holiday == null)
            throw new BadRequestException(badRequestNoHoliday);
        Holiday oldObject = null;
        if (!userBean.getUser().getCompanyId().equals(Objects.requireNonNull(holiday).getCompanyId())) holiday = null;
        else {
            oldObject = cloner.deepClone(holiday);
            if(holiday.getDeleted() == (byte)1)
                throw new BadRequestException(badRequestAlreadyDeleted);
            holiday.setDeleted((byte) 1);
        }

        if(holiday != null) {
            holidayRepository.saveAndFlush(Objects.requireNonNull(holiday));
            logUpdateAction(holiday, oldObject);
            return "Success";
        } else
            throw new ForbiddenException("Nije moguce pristupiti podacima druge kompanije");
    }

    @RequestMapping(value = "/getAllByCompanyId", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCompanyId() {
        return holidayRepository.getAllByCompanyIdAndDeletedEqualsAndCompanyIdOrderByDateAsc(userBean.getUser().getCompanyId(), (byte) 0, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByNameContains(@PathVariable String name) {
        return holidayRepository.getAllByNameContainsIgnoreCaseAndDeletedEqualsAndCompanyIdOrderByDateAsc(name, (byte) 0, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByDateAfter/{date}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByDateAfter(@PathVariable java.sql.Date date) {
        return holidayRepository.getAllByDateAfterAndDeletedEqualsAndCompanyIdOrderByDateAsc(date, (byte) 0, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByDateBefore/{date}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByDateBefore(@PathVariable java.sql.Date date) {
        return holidayRepository.getAllByDateBeforeAndDeletedEqualsAndCompanyIdOrderByDateAsc(date, (byte) 0, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByDateBetween/{from}/{to}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByDateBetween(@PathVariable java.sql.Date from, @PathVariable java.sql.Date to) throws Exception{
        if (Validator.dateCompare(from, to) == -1 )
          return holidayRepository.getAllByDateBetweenAndDeletedEqualsAndCompanyIdOrderByDateAsc(from, to, (byte) 0, userBean.getUser().getCompanyId());
        throw new BadRequestException(badRequestBadDate);
    }
}