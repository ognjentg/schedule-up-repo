package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.GearUnit;
import ba.telegroup.schedule_up.model.modelCustom.GearUnitGear;
import ba.telegroup.schedule_up.repository.GearRepository;
import ba.telegroup.schedule_up.repository.GearUnitRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.GearUnitRepositoryCustom;
import ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl.GearUnitRepositoryImpl;
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
import java.util.Objects;

@RequestMapping(value = "/gear-unit")
@Controller
@Scope("request")
public class GearUnitController extends GenericController<GearUnit, Integer> {

    private GearUnitRepository gearUnitRepository;
    private GearRepository gearRepository;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;

    @Value("${badRequest.inventoryNumberExists}")
    private String badRequestInventoryNumberExists;

    @Autowired
    public GearUnitController(GearUnitRepository repo, GearRepository gearRepository) {
        super(repo);
        this.gearUnitRepository = repo;
        this.gearRepository = gearRepository;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll() {
        return gearUnitRepository.getAllExtendedByCompanyId(userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/custom/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<GearUnitGear> getAllExtendedById(@PathVariable Integer id) {
        return gearUnitRepository.getAllExtendedById(id);
    }

    @RequestMapping(value = "/custom/byRoom/{roomId}", method = RequestMethod.GET)
    public @ResponseBody
    List<GearUnitGear> getAllExtendedByRoomId(@PathVariable Integer roomId) {
        return gearUnitRepository.getAllExtendedByRoomId(userBean.getUser().getCompanyId(), roomId);
    }

    @Transactional
    @RequestMapping(value = "/custom/", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    GearUnitGear insertExtended(@RequestBody GearUnitGear gearUnitGear) throws BadRequestException {
        if(Validator.stringMaxLength(gearUnitGear.getName(),100)) {
            if(Validator.stringMaxLength(gearUnitGear.getDescription(), 500)) {
                if(Validator.stringMaxLength(gearUnitGear.getInventoryNumber(), 100)) {
                    if(gearUnitRepository.countAllByCompanyIdAndInventoryNumber(userBean.getUser().getCompanyId(),gearUnitGear.getInventoryNumber()).compareTo(Integer.valueOf(0))==0){
                        return gearUnitRepository.insertExtended(gearUnitGear);
                    }
                    throw new BadRequestException(badRequestInventoryNumberExists);
                }
                throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "inventarnog broja").replace("{broj}", String.valueOf(100)));
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "opisa").replace("{broj}", String.valueOf(500)));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));

    }

    @Transactional
    @RequestMapping(value = "/custom/", method = RequestMethod.PUT)
    public @ResponseBody
    GearUnitGear updateExtended(@RequestBody GearUnitGear gearUnitGear) throws BadRequestException {
        if(Validator.stringMaxLength(gearUnitGear.getName(),100)) {
            if(Validator.stringMaxLength(gearUnitGear.getDescription(), 500)) {
                if(Validator.stringMaxLength(gearUnitGear.getInventoryNumber(), 100)) {
                    if(gearUnitRepository.countAllByCompanyIdAndInventoryNumber(userBean.getUser().getCompanyId(),gearUnitGear.getInventoryNumber()).compareTo(Integer.valueOf(0))==0){
                        return gearUnitRepository.updateExtended(gearUnitGear);
                    }
                    throw new BadRequestException(badRequestInventoryNumberExists);
                }
                throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "inventarnog broja").replace("{broj}", String.valueOf(100)));
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "opisa").replace("{broj}", String.valueOf(500)));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));

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
