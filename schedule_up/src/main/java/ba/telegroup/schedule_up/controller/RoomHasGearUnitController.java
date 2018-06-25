package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.RoomHasGearUnit;
import ba.telegroup.schedule_up.model.RoomHasGearUnitPK;
import ba.telegroup.schedule_up.repository.RoomHasGearUnitRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

public class RoomHasGearUnitController extends GenericController<RoomHasGearUnit, RoomHasGearUnitPK> {
    private final RoomHasGearUnitRepository roomHasGearUnitRepository;

    public RoomHasGearUnitController(RoomHasGearUnitRepository repo) {
        super(repo);
        this.roomHasGearUnitRepository = repo;
    }

    @SuppressWarnings("SameReturnValue")
    @RequestMapping(value = {"/{roomId}/{gearUnitId}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer roomId, @PathVariable Integer gearUnitId) throws BadRequestException {
        RoomHasGearUnitPK roomHasGearUnitPK = new RoomHasGearUnitPK();
        roomHasGearUnitPK.setRoomId(roomId);
        roomHasGearUnitPK.setGearUnitId(gearUnitId);
        RoomHasGearUnit roomHasGearUnit = repo.findById(roomHasGearUnitPK).orElse(null);
        if (roomHasGearUnit != null) {
            repo.delete(roomHasGearUnit);
            logDeleteAction(roomHasGearUnit);
            return "Success";
        }
        throw new BadRequestException("Bad Request");
    }
}
