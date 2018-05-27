package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Gear;
import ba.telegroup.schedule_up.repository.GearRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping(value="/gear")
@Controller
@Scope("request")
public class GearController extends GenericController<Gear, Integer> {

    public GearController(JpaRepository<Gear, Integer> repo) {
        super(repo);
    }

    @RequestMapping(value = "/getAllByNameContainsIgnoreCase/{name}", method = RequestMethod.GET)
    @ResponseBody public List<Gear> getAllByNameContainsIgnoreCase(@PathVariable String name) {
        return  ((GearRepository)repo).getAllByNameContainsIgnoreCase(name);
    }




}
