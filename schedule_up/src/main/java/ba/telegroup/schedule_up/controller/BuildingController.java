package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Building;
import ba.telegroup.schedule_up.repository.BuildingRepository;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value = "/building")
@Controller
@Scope("request")
public class BuildingController extends GenericController<Building, Integer> {

    private final BuildingRepository buildingRepository;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Value("${badRequest.delete}")
    private String badRequestDelete;

    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;

    @Autowired
    public BuildingController(BuildingRepository repo) {
        super(repo);
        buildingRepository = repo;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll() {
        return buildingRepository.getAllByCompanyIdAndDeletedEquals(userBean.getUser().getCompanyId(), (byte) 0);
    }

    @RequestMapping(value = "/getAllByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByNameContains(@PathVariable String name) {
        return buildingRepository.getAllByCompanyIdAndNameContainsIgnoreCaseAndDeletedEquals(userBean.getUser().getCompanyId(), name, (byte) 0);

    }

    @RequestMapping(value = "/getAllByLongitudeAndLatitude/{longitude}/{latitude}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByLongitudeAndLatitude(@PathVariable Double longitude, @PathVariable Double latitude) {
        return buildingRepository.getAllByCompanyIdAndLongitudeAndLatitudeAndDeletedEquals(userBean.getUser().getCompanyId(), longitude, latitude, (byte) 0);

    }

    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public @ResponseBody
    Building insert(@RequestBody Building building) throws BadRequestException {
        if (Validator.stringMaxLength(building.getName(), 100)) {
            if (Validator.stringMaxLength(building.getDescription(), 500)) {
                if (Validator.stringMaxLength(building.getAddress(), 500)) {
                    if (repo.saveAndFlush(building) != null) {
                        logCreateAction(building);

                        return building;
                    }
                    throw new BadRequestException(badRequestInsert);
                }
                throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "adrese").replace("{broj}", String.valueOf(500)));
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "opisa").replace("{broj}", String.valueOf(500)));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
    }

    @Transactional
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    @Override
    public @ResponseBody
    String update(@PathVariable Integer id, @RequestBody Building building) throws BadRequestException {
        if (Validator.stringMaxLength(building.getName(), 100)) {
            if (Validator.stringMaxLength(building.getDescription(), 500)) {
                Building oldObject = cloner.deepClone(repo.findById(id).orElse(null));
                if (repo.saveAndFlush(building) != null) {
                    logUpdateAction(building, oldObject);
                    return "Success";
                }
                throw new BadRequestException(badRequestUpdate);
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "opisa").replace("{broj}", String.valueOf(500)));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        Building building = buildingRepository.findById(id).orElse(null);
        if (building != null) {
            building.setDeleted((byte) 1);
            repo.saveAndFlush(building);
            logDeleteAction(building);
            return "Success";
        }
        throw new BadRequestException(badRequestDelete);
    }

//    @Override
//    @Transactional
//    @RequestMapping(method = RequestMethod.GET)
//    public @ResponseBody List<Building> getAll() {
//        List<Building> buildings = super.getAll();
//        List<Building> result=new ArrayList<>();
//        for (Building b:
//             buildings) {
//            if(b.getDeleted()!=(byte)1){
//                result.add(b);
//            }
//        }
//        return result;
//    }

//    @Override
//    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
//    public @ResponseBody Building findById(@PathVariable Integer id) {
//        Building building = super.findById(id);
//        if(building.getDeleted()!=(byte)1){
//            return building;
//        }
//        return null;
//    }
}
