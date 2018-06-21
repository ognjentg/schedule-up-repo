package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Building;
import ba.telegroup.schedule_up.repository.BuildingRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@RequestMapping(value = "/building")
@Controller
@Scope("request")
public class BuildingController extends GenericController<Building, Integer> {
    public BuildingController(JpaRepository<Building, Integer> repo) {
        super(repo);
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll() {
        return ((BuildingRepository) repo).getAllByCompanyIdAndDeletedEquals(userBean.getUser().getCompanyId(), (byte) 0);

    }

    @RequestMapping(value = "/getAllByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByNameContains(@PathVariable String name) {
        return ((BuildingRepository) repo).getAllByCompanyIdAndNameContainsIgnoreCaseAndDeletedEquals(userBean.getUser().getCompanyId(), name, (byte) 0);

    }

    @RequestMapping(value = "/getAllByLongitudeAndLatitude/{longitude}/{latitude}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllByLongitudeAndLatitude(@PathVariable Double longitude, @PathVariable Double latitude) {
        return ((BuildingRepository) repo).getAllByCompanyIdAndLongitudeAndLatitudeAndDeletedEquals(userBean.getUser().getCompanyId(), longitude, latitude, (byte) 0);

    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        Building building = repo.findById(id).orElse(null);
        if (building != null) {
            building.setDeleted((byte) 1);
            repo.saveAndFlush(building);
            logDeleteAction(building);
            return "Success";
        }
        throw new BadRequestException("Bad request");
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
