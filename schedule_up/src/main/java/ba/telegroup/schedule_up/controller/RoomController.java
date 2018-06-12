package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Building;
import ba.telegroup.schedule_up.model.Note;
import ba.telegroup.schedule_up.model.Room;
import ba.telegroup.schedule_up.model.modelCustom.LoggerUser;
import ba.telegroup.schedule_up.model.modelCustom.RoomBuilding;
import ba.telegroup.schedule_up.repository.BuildingRepository;
import ba.telegroup.schedule_up.repository.NoteRepository;
import ba.telegroup.schedule_up.repository.RoomRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.LoggerRepositoryCustom;
import ba.telegroup.schedule_up.repository.repositoryCustom.RoomRepositoryCustom;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@RequestMapping(value = "/room")
@Controller
@Scope("request")
public class RoomController extends GenericController<Room, Integer> {
    public RoomController(JpaRepository<Room, Integer> repo) {
        super(repo);
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody String delete(@PathVariable Integer id) throws BadRequestException {
        Room room=((RoomRepository) repo).findById(id).orElse(null);
        if (room!=null) {
            room.setDeleted((byte) 1);
            if (((RoomRepository) repo).saveAndFlush(room) != null) {
                logDeleteAction(room);
                return "Success";
            }
        }
        throw new BadRequestException("Bad request");
    }

    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll() { return ((RoomRepositoryCustom) repo).getAllExtendedByCompanyId(userBean.getUser().getCompanyId());
    }
}
