package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.GearUnit;
import ba.telegroup.schedule_up.model.modelCustom.GearUnitGear;
import ba.telegroup.schedule_up.repository.GearUnitRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.GearUnitRepositoryCustom;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping(value="/gear-unit")
@Controller
@Scope("request")
public class GearUnitController extends GenericController<GearUnit, Integer> {

    public GearUnitController(JpaRepository<GearUnit, Integer> repo) {
        super(repo);
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public @ResponseBody
    List<GearUnitGear> getAllExtended() {
        return ((GearUnitRepositoryCustom) repo).getAllExtendedByCompanyId(userBean.getUser().getCompanyId());
    }

    @RequestMapping(value ="/custom/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<GearUnitGear> getAllExtendedById(@PathVariable Integer id) {
        return ((GearUnitRepositoryCustom)repo).getAllExtendedById(id);
    }

    @Transactional
    @RequestMapping(value ="/", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    GearUnitGear insertExtended(@RequestBody GearUnitGear gearUnitGear) throws BadRequestException {
        return  ((GearUnitRepositoryCustom)repo).insertExtended(gearUnitGear);
    }

    @Transactional
    @RequestMapping(value ="/", method = RequestMethod.PUT)
    public @ResponseBody
    GearUnitGear updateExtended(@RequestBody GearUnitGear gearUnitGear) throws BadRequestException {
        return  ((GearUnitRepositoryCustom)repo).updateExtended(gearUnitGear);
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        GearUnit gearUnit=((GearUnitRepository) repo).findById(id).orElse(null);
        gearUnit.setDeleted((byte)1);
        if (((GearUnitRepository) repo).saveAndFlush(gearUnit) != null) {
            logDeleteAction(gearUnit);
            return "Success";
        }
        else {
            throw new BadRequestException("Bad request");
        }
    }



}
