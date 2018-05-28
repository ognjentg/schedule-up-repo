package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
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

    @RequestMapping(value = "/getAllByNameContainsIgnoreCase/{name}", method = RequestMethod.GET)
    @ResponseBody
    public List<Gear> getAllByNameContainsIgnoreCase(@PathVariable String name) {
        return ((GearRepository) repo).getAllByNameContainsIgnoreCase(name);
    }

    @Override
    public List<Gear> getAll() {
        return null;
    }

    @Override
    public Gear findById(Integer integer) {
        return null;
    }

    @Override
    public Gear insert(Gear object) throws BadRequestException {
        throw new BadRequestException("Method Not Allowed");
    }

    @Override
    public String update(Integer integer, Gear object) throws BadRequestException {
        throw new BadRequestException("Method Not Allowed");
    }

    @Override
    public String delete(Integer integer) throws BadRequestException {
        throw new BadRequestException("Method Not Allowed");
    }
}
