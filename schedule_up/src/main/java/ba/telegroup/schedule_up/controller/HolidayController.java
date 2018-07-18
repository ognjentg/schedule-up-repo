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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
    @Value("${badRequest.insert}")
    private String badRequestInsert;
    @Value("${badRequest.holidayNameExists}")
    private String badRequestHolidayNameExists;

    @Autowired
    public HolidayController(HolidayRepository repo) {
        super(repo);
        this.holidayRepository = repo;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<Holiday> getAll() {
        return holidayRepository.getAllByDeletedEqualsAndCompanyId((byte) 0, userBean.getUser().getCompanyId());
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException, ForbiddenException {
        Holiday holiday = holidayRepository.findById(id).orElse(null);
        if (holiday == null)
            throw new BadRequestException(badRequestNoHoliday);
        Holiday oldObject = null;
        if (!userBean.getUser().getCompanyId().equals(Objects.requireNonNull(holiday).getCompanyId())) holiday = null;
        else {
            oldObject = cloner.deepClone(holiday);
            if (holiday.getDeleted() == (byte) 1)
                throw new BadRequestException(badRequestAlreadyDeleted);
            holiday.setDeleted((byte) 1);
        }

        if (holiday != null) {
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
    List getAllByDateBetween(@PathVariable java.sql.Date from, @PathVariable java.sql.Date to) throws Exception {
        if (Validator.dateCompare(from, to) == -1)
            return holidayRepository.getAllByDateBetweenAndDeletedEqualsAndCompanyIdOrderByDateAsc(from, to, (byte) 0, userBean.getUser().getCompanyId());
        throw new BadRequestException(badRequestBadDate);
    }

    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public @ResponseBody
    Holiday insert(@RequestBody Holiday holiday) throws BadRequestException {
        java.sql.Date currentDate = new java.sql.Date(System.currentTimeMillis());
        if (Validator.dateCompare(holiday.getDate(), currentDate) <= 0) {
            throw new BadRequestException(badRequestBadDate);
        }
        List<Holiday> activeHolidays = holidayRepository.getAllByDeletedEqualsAndCompanyId((byte) 0, userBean.getUser().getCompanyId());
        if (activeHolidays != null) {
            for (Holiday temp : activeHolidays) {
                if (temp.getName().equals(holiday.getName())) {
                    throw new BadRequestException(badRequestHolidayNameExists);
                }
            }
        }
        if (repo.saveAndFlush(holiday) != null) {
            logCreateAction(holiday);
            return holiday;
        }
        throw new BadRequestException(badRequestInsert);
    }

}