package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Reminder;
import ba.telegroup.schedule_up.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Objects;

@RequestMapping(value = "/reminder")
@Controller
@Scope("request")
public class ReminderController extends GenericController<Reminder, Integer> {

    public ReminderController(JpaRepository<Reminder, Integer> repo) {
        super(repo);
    }

    private ReminderRepository reminderRepository;

    @Value("${badRequest.noReminder}")
    private String badRequestNoReminder;

    @Autowired
    public ReminderController(ReminderRepository repo) {
        super(repo);
        this.reminderRepository = repo;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<Reminder> getAll() {
        return reminderRepository.getAllByDeletedEquals((byte) 0);
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        Reminder reminder = repo.findById(id).orElse(null);
        if (reminder != null) {
            (reminder).setDeleted((byte) 1);
            repo.saveAndFlush(reminder);
            logDeleteAction(reminder);
            return "Success";
        }
        throw new BadRequestException(badRequestNoReminder);
    }

}
