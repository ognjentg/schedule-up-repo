package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.GearUnit;
import ba.telegroup.schedule_up.model.modelCustom.GearUnitGear;
import ba.telegroup.schedule_up.repository.repositoryCustom.GearUnitRepositoryCustom;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

    @RequestMapping(value = "/gear-unit")
@Controller
@Scope("request")
public class GearUnitController extends GenericController<GearUnit, Integer> {

    public GearUnitController(JpaRepository<GearUnit, Integer> repo) {
        super(repo);
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll() {
        return ((GearUnitRepositoryCustom) repo).getAllExtendedByCompanyId(userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/custom/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<GearUnitGear> getAllExtendedById(@PathVariable Integer id) {
        return ((GearUnitRepositoryCustom) repo).getAllExtendedById(id);
    }

    @Transactional
    @RequestMapping(value = "/custom/", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    GearUnitGear insertExtended(@RequestBody GearUnitGear gearUnitGear) {
        return ((GearUnitRepositoryCustom) repo).insertExtended(gearUnitGear);
    }

    @Transactional
    @RequestMapping(value = "/custom/", method = RequestMethod.PUT)
    public @ResponseBody
    GearUnitGear updateExtended(@RequestBody GearUnitGear gearUnitGear) {
        return ((GearUnitRepositoryCustom) repo).updateExtended(gearUnitGear);
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) {
        GearUnit gearUnit = repo.findById(id).orElse(null);
        Objects.requireNonNull(gearUnit).setDeleted((byte) 1);
        repo.saveAndFlush(gearUnit);
        logDeleteAction(gearUnit);
        return "Success";
    }


}
