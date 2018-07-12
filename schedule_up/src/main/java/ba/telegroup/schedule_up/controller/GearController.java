package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Gear;
import ba.telegroup.schedule_up.repository.GearRepository;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value = "/gear")
@Controller
@Scope("request")
public class GearController extends GenericController<Gear, Integer> {

    private GearRepository gearRepository;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Autowired
    public GearController(GearRepository repo) {
        super(repo);
        this.gearRepository = repo;
    }

    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    @ResponseBody
    public List<Gear> getAllByNameContainsIgnoreCase(@PathVariable String name) {
        return gearRepository.getAllByNameContainsIgnoreCase(name);
    }

    @RequestMapping(value = "/getAllNames", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getAllNames() {
        return gearRepository.getAllNames();
    }

    @Override
    @DeleteMapping
    public Gear findById(Integer integer) {
        return null;
    }

    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    Gear insert(@RequestBody Gear object) throws ForbiddenException, BadRequestException {
        List<Gear> gears = gearRepository.getAllByNameContainsIgnoreCase(object.getName());
        if (gears == null || gears.size() == 0) {
            if (Integer.valueOf(2).equals(userBean.getUser().getRoleId()) || Integer.valueOf(3).equals(userBean.getUser().getRoleId())) {
                if (object.getName() != null) {
                    if(Validator.stringMaxLength(object.getName(), 100)) {
                        return super.insert(object);
                    }
                    throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
                }
                throw new BadRequestException(badRequestInsert);
            }
            throw new ForbiddenException("Forbidden action");
        } else {
            if (gears.size() > 1)
                throw new BadRequestException(badRequestInsert);
            if(Validator.stringMaxLength(object.getName(), 100)) {
                update(object.getId(), object);
            }
            else {
                throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
            }
            return object;
        }
    }

    @RequestMapping(method = RequestMethod.PUT)
    public @ResponseBody
    String update(@RequestBody Gear object) throws BadRequestException, ForbiddenException {
        return update(null, object);
    }

    @Override
    public String update(Integer integer, Gear object) throws ForbiddenException, BadRequestException {
        List<Gear> gears = gearRepository.getAllByNameContainsIgnoreCase(object.getName());
        if (gears == null || gears.size() != 1)
            throw new BadRequestException(badRequestUpdate);
        Gear oldObj = gears.get(0);
        if (Integer.valueOf(2).equals(userBean.getUser().getRoleId()) || Integer.valueOf(3).equals(userBean.getUser().getRoleId())) {
            if (object.getName() != null) {
                if(Validator.stringMaxLength(object.getName(),100)) {
                    return super.update(oldObj.getId(), object);
                }
                throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
            }
            throw new BadRequestException(badRequestUpdate);
        }
        throw new ForbiddenException("Forbidden action");
    }

    @Override
    public String delete(Integer integer) throws ForbiddenException {
        throw new ForbiddenException("Forbidden");
    }

}
