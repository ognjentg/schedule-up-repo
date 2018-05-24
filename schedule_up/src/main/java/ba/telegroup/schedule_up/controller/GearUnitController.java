package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.GearUnit;
import ba.telegroup.schedule_up.repository.GearUnitRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping(value="/gear-unit")
@Controller
@Scope("request")
public class GearUnitController extends GenericController<GearUnit, Integer> {

    public GearUnitController(JpaRepository<GearUnit, Integer> repo) {
        super(repo);
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<GearUnit> getAll() {
        return ((GearUnitRepository)repo).findAll().stream()
                .filter(x -> x.getDeleted().equals(Byte.valueOf("0"))).collect(Collectors.toList());
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        GearUnit gearUnit=((GearUnitRepository) repo).findById(id).orElse(null);
        GearUnit oldObject = cloner.deepClone(gearUnit);
        gearUnit.setDeleted((byte)1);
        if (((GearUnitRepository) repo).saveAndFlush(gearUnit) != null) {
            logUpdateAction(gearUnit, oldObject);
            return "Success";
        }
        throw new BadRequestException("Bad request");
    }



}
