package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Reminder;
import ba.telegroup.schedule_up.repository.ReminderRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@RequestMapping(value = "/reminder")
@Controller
@Scope("request")
public class ReminderController extends GenericController<Reminder, Integer> {

    public ReminderController(JpaRepository<Reminder, Integer> repo) {
        super(repo);
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<Reminder> getAll() {
        List<Reminder> reminders = ((ReminderRepository) repo).findAll();
        List<Reminder> retVal = new ArrayList<>();
        for (Reminder reminder : reminders) {
            if (reminder.getDeleted() != (byte) 1) {
                retVal.add(reminder);
            }
        }
        return retVal;
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        Reminder reminder = ((ReminderRepository) repo).findById(id).orElse(null);
        Reminder oldObject = cloner.deepClone(reminder);
        reminder.setDeleted((byte) 1);
        if (((ReminderRepository) repo).saveAndFlush(reminder) != null) {
            logUpdateAction(reminder, oldObject);
            return "Success";
        }
        throw new BadRequestException("Bad request");
    }
    
}
