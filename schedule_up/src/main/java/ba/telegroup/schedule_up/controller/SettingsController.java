package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Settings;
import ba.telegroup.schedule_up.repository.SettingsRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@RequestMapping(value = "/settings")
@Controller
@Scope("request")
public class SettingsController extends GenericController<Settings, Integer>{
    public SettingsController(JpaRepository<Settings, Integer> repo) {
        super(repo);
    }

    @RequestMapping(value = "/getAllByCompanyId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCompanyId(@PathVariable Integer id) {
        return ((SettingsRepository) repo).getAllByCompanyId(id);
    }

    @RequestMapping(value = "/getAllByReminderTimeAfter/{time}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByRemainderTimeAfter(@PathVariable java.sql.Time time) {
        return ((SettingsRepository) repo).getAllByReminderTimeAfter(time);
    }

    @RequestMapping(value = "/getAllByReminderTimeBefore/{time}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByRemainderTimeBefore(@PathVariable java.sql.Time time) {
        return ((SettingsRepository) repo).getAllByReminderTimeBefore(time);
    }

    @RequestMapping(value = "/getAllByReminderTimeBetween/{from}/{to}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByRemainderTimeBetween(@PathVariable java.sql.Time from, @PathVariable java.sql.Time to) {
        return ((SettingsRepository) repo).getAllByReminderTimeBetween(from, to);
    }

    @RequestMapping(value = "/getAllByCancelTimeAfter/{time}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCancelTimeAfter(@PathVariable java.sql.Time time) {
        return ((SettingsRepository) repo).getAllByCancelTimeAfter(time);
    }

    @RequestMapping(value = "/getAllByCancelTimeBefore/{time}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCancelTimeBefore(@PathVariable java.sql.Time time) {
        return ((SettingsRepository) repo).getAllByCancelTimeBefore(time);
    }

    @RequestMapping(value = "/getAllByCancelTimeBetween/{from}/{to}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCancelTimeBetween(@PathVariable java.sql.Time from, @PathVariable java.sql.Time to) {
        return ((SettingsRepository) repo).getAllByCancelTimeBetween(from, to);
    }

}
