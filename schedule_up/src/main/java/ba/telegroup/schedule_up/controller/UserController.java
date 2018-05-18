package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.User;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/user")
@Controller
@Scope("request")
public class UserController extends GenericController<User, Integer> {

    public UserController(JpaRepository<User, Integer> repo) { super(repo); }
}
