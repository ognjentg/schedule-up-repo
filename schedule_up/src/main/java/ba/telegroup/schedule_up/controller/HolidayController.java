package ba.telegroup.schedule_up.controller;

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

import java.util.List;
import java.util.Objects;

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
        return ((HolidayRepository) repo).getAllByDeletedEqualsAndCompanyId((byte) 0, userBean.getUser().getCompanyId());
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) {
        Holiday holiday = repo.findById(id).orElse(null);
        Holiday oldObject = null;
        //Holiday holiday = ((HolidayRepository) repo).findOneByIdAndCompanyId(id, userBean.getUser().getCompanyId());
        if (!userBean.getUser().getCompanyId().equals(Objects.requireNonNull(holiday).getCompanyId())) holiday = null;
        else {
            oldObject = cloner.deepClone(holiday);
            holiday.setDeleted((byte) 1);
        }

        repo.saveAndFlush(Objects.requireNonNull(holiday));
        logUpdateAction(holiday, oldObject);
        return "Success";
    }

    @RequestMapping(value = "/getAllByCompanyId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCompanyId(@PathVariable Integer id) {
        return ((HolidayRepository) repo).getAllByCompanyIdAndDeletedEqualsAndCompanyId(userBean.getUser().getCompanyId(), (byte) 0, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByNameContains(@PathVariable String name) {
        return ((HolidayRepository) repo).getAllByNameContainsIgnoreCaseAndDeletedEqualsAndCompanyId(name, (byte) 0, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByDateAfter/{date}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByDateAfter(@PathVariable java.sql.Date date) {
        return ((HolidayRepository) repo).getAllByDateAfterAndDeletedEqualsAndCompanyId(date, (byte) 0, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByDateBefore/{date}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByDateBefore(@PathVariable java.sql.Date date) {
        return ((HolidayRepository) repo).getAllByDateBeforeAndDeletedEqualsAndCompanyId(date, (byte) 0, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByDateBetween/{from}/{to}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByDateBetween(@PathVariable java.sql.Date from, @PathVariable java.sql.Date to) {
        return ((HolidayRepository) repo).getAllByDateBetweenAndDeletedEqualsAndCompanyId(from, to, (byte) 0, userBean.getUser().getCompanyId());
    }
}