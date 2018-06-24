package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Settings;
import ba.telegroup.schedule_up.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@RequestMapping(value = "/settings")
@Controller
@Scope("request")
public class SettingsController extends GenericController<Settings, Integer> {
    private SettingsRepository settingsRepository;

    public SettingsController(JpaRepository<Settings, Integer> repo) {
        super(repo);
    }

    @Autowired
    public SettingsController(SettingsRepository repo) {
        super(repo);
        this.settingsRepository = repo;
    }

    @RequestMapping(value = "/getByCompanyId/{id}", method = RequestMethod.GET)
    public @ResponseBody
    Settings getByCompanyId(@PathVariable Integer id) {
        return settingsRepository.getByCompanyId(id);
    }

    @RequestMapping(value = "/getAllByReminderTimeAfter/{time}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByRemainderTimeAfter(@PathVariable java.sql.Time time) {
        return settingsRepository.getAllByReminderTimeAfterAndCompanyId(time, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByReminderTimeBefore/{time}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByRemainderTimeBefore(@PathVariable java.sql.Time time) {
        return settingsRepository.getAllByReminderTimeBeforeAndCompanyId(time, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByReminderTimeBetween/{from}/{to}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByRemainderTimeBetween(@PathVariable java.sql.Time from, @PathVariable java.sql.Time to) {
        return settingsRepository.getAllByReminderTimeBetweenAndCompanyId(from, to, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByCancelTimeAfter/{time}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCancelTimeAfter(@PathVariable java.sql.Time time) {
        return settingsRepository.getAllByCancelTimeAfterAndCompanyId(time, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByCancelTimeBefore/{time}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCancelTimeBefore(@PathVariable java.sql.Time time) {
        return settingsRepository.getAllByCancelTimeBeforeAndCompanyId(time, userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/getAllByCancelTimeBetween/{from}/{to}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByCancelTimeBetween(@PathVariable java.sql.Time from, @PathVariable java.sql.Time to) {
        return settingsRepository.getAllByCancelTimeBetweenAndCompanyId(from, to, userBean.getUser().getCompanyId());
    }

}

