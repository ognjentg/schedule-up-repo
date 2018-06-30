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
        throw new BadRequestException("Bad request");
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
        Room room = roomRepository.getOne(roomId);
        Room oldRoom = cloner.deepClone(room);
        GearUnit gearUnit = gearUnitRepository.getOne(gearUnitId);
        //GearUnit oldGearUnit = cloner.deepClone(gearUnit);
        if((room.getCapacity() != 0) && (gearUnit.getAvailable() == (byte) 1)){
            room.setCapacity(room.getCapacity()-1);
            gearUnit.setAvailable((byte) 0);
            RoomHasGearUnit connection = new RoomHasGearUnit();
            connection.setRoomId(roomId);
            connection.setGearUnitId(gearUnitId);
            connection.setCurrently((byte) 1);
            roomHasGearUnitRepository.saveAndFlush(connection);
            gearUnitRepository.saveAndFlush(gearUnit);
            if (roomRepository.saveAndFlush(room) != null) logUpdateAction(room, oldRoom);
            return "Success";
        }
        throw new BadRequestException("Bad request");
    }

    @RequestMapping(value = "/removeGearUnit/{roomId}/{gearUnitId}", method = RequestMethod.GET)
    public @ResponseBody
    String removeGearUnit(@PathVariable Integer roomId, @PathVariable Integer gearUnitId)throws BadRequestException {
        Room room = roomRepository.getOne(roomId);
        Room oldRoom = cloner.deepClone(room);
        GearUnit gearUnit = gearUnitRepository.getOne(gearUnitId);
        RoomHasGearUnitPK pk = new RoomHasGearUnitPK();
        pk.setRoomId(roomId);
        pk.setGearUnitId(gearUnitId);
        RoomHasGearUnit connection = roomHasGearUnitRepository.getOne(pk);
        if((gearUnit.getAvailable() == (byte) 0)){
            room.setCapacity(room.getCapacity()+1);
            gearUnit.setAvailable((byte) 1);
            roomHasGearUnitRepository.delete(connection);
            gearUnitRepository.saveAndFlush(gearUnit);
            if (roomRepository.saveAndFlush(room) != null) logUpdateAction(room, oldRoom);
            return "Success";
        }
        throw new BadRequestException("Bad request");
    }

    public Room getRoomById(Integer id){
        return roomRepository.getRoomById(id);
    }

    @RequestMapping(value = "/getBuildingByRoomId/{id}",method = RequestMethod.GET)
    public @ResponseBody
    Building getBuildingByRoomId(@PathVariable Integer id) throws BadRequestException{
        Room room = getRoomById(id);
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
            throw new BadRequestException("Bad request");
        }
        throw new BadRequestException("Bad request");
    }
}
