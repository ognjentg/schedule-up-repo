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
    /*@Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<Settings> getAll() {
        List<Settings> settings = ((SettingsRepository) repo).findAll();
        List<Settings> retVal = new ArrayList<>();
        for (Settings setting : settings) {
            //if (setting.getDeleted() != (byte) 1) {
                retVal.add(setting);
            //}
        }
        return retVal;
    }*/
}
