package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Building;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/building")
@Controller
@Scope("request")
public class BuildingController extends GenericController<Building, Integer> {

    public BuildingController(JpaRepository<Building, Integer> repo) {
        super(repo);
    }
}
