package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.*;
import ba.telegroup.schedule_up.repository.BuildingRepository;
import ba.telegroup.schedule_up.repository.GearUnitRepository;
import ba.telegroup.schedule_up.repository.RoomHasGearUnitRepository;
import ba.telegroup.schedule_up.repository.RoomRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.GearUnitRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
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

    private final RoomRepository roomRepository;
    private final RoomHasGearUnitRepository roomHasGearUnitRepository;
    private final GearUnitRepository gearUnitRepository;
    private final BuildingRepository buildingRepository;

    @Value("${badRequest.alreadyTaken}")
    private String badRequestAlreadyTaken;

    @Value("${badRequest.noGearUnitInRoom}")
    private String badRequestNoGearUnitInRoom;

    @Value("${badRequest.alreadyReleased}")
    private String badRequestAlreadyReleased;

    @Value("${badRequest.noRoom}")
    private String badRequestNoRoom;

    @Value("${badRequest.noBuilding}")
    private String badRequestNoBuilding;

    @Value("${badRequest.noGearUnit}")
    private String badRequestNoGearUnit;


    @Autowired
    public RoomController(RoomRepository roomRepository, RoomHasGearUnitRepository roomHasGearUnitRepository, GearUnitRepository gearUnitRepository, BuildingRepository buildingRepository) {
        super(roomRepository);
        this.roomRepository = roomRepository;
        this.roomHasGearUnitRepository = roomHasGearUnitRepository;
        this.gearUnitRepository = gearUnitRepository;
        this.buildingRepository = buildingRepository;
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        Room room = roomRepository.findById(id).orElse(null);
        if (room != null) {
            room.setDeleted((byte) 1);
            roomRepository.saveAndFlush(room);
            logDeleteAction(room);
            return "Success";
        }
        throw new BadRequestException(badRequestNoRoom);
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll() {
        return roomRepository.getAllExtendedByCompanyId(userBean.getUser().getCompanyId());
    }

    @RequestMapping(value = "/addGearUnit/{roomId}/{gearUnitId}", method = RequestMethod.GET)
    public @ResponseBody
    String addGearUnit(@PathVariable Integer roomId, @PathVariable Integer gearUnitId)throws BadRequestException {
        Room room = roomRepository.getRoomById(roomId);
        if(room == null)
            throw new BadRequestException(badRequestNoRoom);
        Room oldRoom = cloner.deepClone(room);
        GearUnit gearUnit = gearUnitRepository.getGearUnitById(gearUnitId);
        if(gearUnit == null)
            throw new BadRequestException(badRequestNoGearUnit);
    if(gearUnit.getAvailable() == (byte) 1){
        gearUnit.setAvailable((byte) 0);
        RoomHasGearUnit connection = new RoomHasGearUnit();
        connection.setRoomId(roomId);
        connection.setGearUnitId(gearUnitId);
        roomHasGearUnitRepository.saveAndFlush(connection);
        gearUnitRepository.saveAndFlush(gearUnit);
        if (roomRepository.saveAndFlush(room) != null) logUpdateAction(room, oldRoom);
        return "Success";
    }
    else throw new BadRequestException(badRequestAlreadyTaken);
}
    @RequestMapping(value = "/removeGearUnit/{roomId}/{gearUnitId}", method = RequestMethod.GET)
    public @ResponseBody
    String removeGearUnit(@PathVariable Integer roomId, @PathVariable Integer gearUnitId)throws BadRequestException {
        Room room = roomRepository.getRoomById(roomId);
        if(room == null)
            throw new BadRequestException(badRequestNoRoom);
        Room oldRoom = cloner.deepClone(room);
        GearUnit gearUnit = gearUnitRepository.getGearUnitById(gearUnitId);
        if(gearUnit == null)
            throw new BadRequestException(badRequestNoGearUnit);
        RoomHasGearUnitPK pk = new RoomHasGearUnitPK();
        pk.setRoomId(roomId);
        pk.setGearUnitId(gearUnitId);
        RoomHasGearUnit connection = roomHasGearUnitRepository.getRoomHasGearUnitByRoomIdAndGearUnitId(roomId, gearUnitId);
        if(connection == null)
            throw new BadRequestException(badRequestNoGearUnitInRoom);
        else if((gearUnit.getAvailable() == (byte) 0)){
            gearUnit.setAvailable((byte) 1);
            roomHasGearUnitRepository.delete(connection);
            gearUnitRepository.saveAndFlush(gearUnit);
            if (roomRepository.saveAndFlush(room) != null) logUpdateAction(room, oldRoom);
            return "Success";
        }
        else throw new BadRequestException(badRequestAlreadyReleased);
    }

    public Room getRoomById(Integer id){
        return roomRepository.getRoomById(id);
    }

    @RequestMapping(value = "/getBuildingByRoomId/{id}",method = RequestMethod.GET)
    public @ResponseBody
    Building getBuildingByRoomId(@PathVariable Integer id) throws BadRequestException{
        Room room = cloner.deepClone(getRoomById(id));
        if(room != null) {
            Building building = buildingRepository.getBuildingsById(room.getBuildingId());
            if(building != null) {
                building.setAddress(null);
                building.setDescription(null);
                building.setName(null);
                building.setCompanyId(null);
                building.setDeleted(null);
                return building;
            }
            throw new BadRequestException(badRequestNoBuilding);
        }
        throw new BadRequestException(badRequestNoRoom);
    }
}
