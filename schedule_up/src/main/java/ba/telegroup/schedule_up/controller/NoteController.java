package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Note;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/note")
@Controller
@Scope("request")
public class NoteController extends GenericController<Note, Integer> {
    public NoteController(JpaRepository<Note, Integer> repo) {
        super(repo);
    }
}
