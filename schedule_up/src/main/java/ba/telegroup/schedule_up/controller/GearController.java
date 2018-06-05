package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Gear;
import ba.telegroup.schedule_up.repository.GearRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value="/gear")
@Controller
@Scope("request")
public class GearController extends GenericController<Gear, Integer> {

    public GearController(JpaRepository<Gear, Integer> repo) {
        super(repo);
    }

    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    @ResponseBody
    public List<Gear> getAllByNameContainsIgnoreCase(@PathVariable String name) {
        return ((GearRepository) repo).getAllByNameContainsIgnoreCase(name);
    }
        
    @Override
    @DeleteMapping
    public Gear findById(Integer integer) {
        return null;
    }

    @Override
    public Gear insert(Gear object) throws ForbiddenException {
        throw new ForbiddenException("Forbidden");
    }

    @Override
    public String update(Integer integer, Gear object) throws ForbiddenException {
        throw new ForbiddenException("Forbidden");
    }

    @Override
    public String delete(Integer integer) throws ForbiddenException {
        throw new ForbiddenException("Forbidden");
    }
}
