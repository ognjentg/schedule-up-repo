package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.*;
import ba.telegroup.schedule_up.model.modelCustom.RoomBuilding;
import ba.telegroup.schedule_up.repository.*;
import ba.telegroup.schedule_up.repository.repositoryCustom.GearUnitRepositoryCustom;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RequestMapping(value = "/room")
@Controller
@Scope("request")
public class RoomController extends GenericController<Room, Integer> {

    private final RoomRepository roomRepository;
    private final RoomHasGearUnitRepository roomHasGearUnitRepository;
    private final GearUnitRepository gearUnitRepository;
    private final BuildingRepository buildingRepository;
    private final MeetingRepository meetingRepository;
    private final CompanyRepository companyRepository;

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

    @Value("${badRequest.numberNotNegative}")
    private String badRequestNumberNotNegative;

    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;

    @Value("${badRequest.dateTimeCompare}")
    private String badRequestDateTimeCompare;

    @PersistenceContext
    private EntityManager entityManager;



    @Autowired
    public RoomController(RoomRepository roomRepository, RoomHasGearUnitRepository roomHasGearUnitRepository, GearUnitRepository gearUnitRepository, BuildingRepository buildingRepository, MeetingRepository meetingRepository, CompanyRepository companyRepository) {
        super(roomRepository);
        this.roomRepository = roomRepository;
        this.roomHasGearUnitRepository = roomHasGearUnitRepository;
        this.gearUnitRepository = gearUnitRepository;
        this.buildingRepository = buildingRepository;
        this.meetingRepository = meetingRepository;
        this.companyRepository = companyRepository;
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

    @Transactional
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

    @Transactional
    @RequestMapping(value = "/addGearUnits/{roomId}", method = RequestMethod.POST)
    public @ResponseBody
    String addGearUnits(@PathVariable Integer roomId, @RequestBody List<Integer> gearIds)throws BadRequestException {
        Room room = roomRepository.getRoomById(roomId);
        if(room == null)
            throw new BadRequestException(badRequestNoRoom);
      for(Integer gearId:gearIds)
          addGearUnit(roomId,gearId);
        return "Success";
    }

    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    @Override
    public @ResponseBody
    RoomBuilding insert(@RequestBody Room room) throws BadRequestException {
        if (Validator.stringMaxLength(room.getName(), 100)) {
            if (Validator.stringMaxLength(room.getDescription(), 500)) {
                if (Validator.integerNotNegative(room.getFloor())) {
                    if(Validator.integerNotNegative(room.getCapacity())) {
                        if (roomRepository.saveAndFlush(room) != null) {
                            logCreateAction(room);
                            entityManager.refresh(room);

                            Building building = buildingRepository.getBuildingsById(room.getBuildingId());
                            RoomBuilding roomBuilding = new RoomBuilding();

                            roomBuilding.setId(room.getId());
                            roomBuilding.setName(room.getName());
                            roomBuilding.setFloor(room.getFloor());
                            roomBuilding.setCapacity(room.getCapacity());
                            roomBuilding.setPin(room.getPin());
                            roomBuilding.setDeleted(room.getDeleted());
                            roomBuilding.setDescription(room.getDescription());
                            roomBuilding.setBuildingId(room.getBuildingId());
                            roomBuilding.setCompanyId(room.getCompanyId());
                            roomBuilding.setBuildingName(building.getName());
                            roomBuilding.setLongitude(building.getLongitude());
                            roomBuilding.setLatitude(building.getLatitude());

                            return roomBuilding;
                        }
                    }
                    throw new BadRequestException(badRequestNumberNotNegative.replace("{tekst}", "kapacitet"));
                }
                throw new BadRequestException(badRequestNumberNotNegative.replace("{tekst}", "sprat"));
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "opisa").replace("{broj}", String.valueOf(500)));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
    }

    //metoda koja vraca postotak zauzetosti neke sale u datom periodu u odnosu na ukupno radno vrijeme u tom periodu
    @RequestMapping(value = "getOccupancy/{roomId}/{dateFrom}/{dateTo}", method = RequestMethod.GET)
    public @ResponseBody
    double getPercentageOfRoomOccupancy(@PathVariable Integer roomId, @PathVariable java.sql.Date dateFrom, @PathVariable java.sql.Date dateTo) throws BadRequestException, ForbiddenException {
        Room room = roomRepository.getRoomById(roomId);
        if(Validator.dateCompare(dateFrom, dateTo) == 1)
            throw new BadRequestException(badRequestDateTimeCompare);

        List<Integer> idsOfMeetingsInThisPeriod = meetingRepository.getIdsOfMeetingsBetween(new Timestamp(dateFrom.getTime()), new Timestamp(dateTo.getTime()), roomId);
        List<Meeting> meetingsInThisPeriod = new ArrayList<>();
        for(Integer meetingId : idsOfMeetingsInThisPeriod){
            Meeting meeting = meetingRepository.findById(meetingId).orElse(null);
            if(meeting != null)
                meetingsInThisPeriod.add(meeting);
        }
        if(room != null){
            Company company = companyRepository.getById(room.getCompanyId());
            long companyWorkTime = companyRepository.getCompanyWorkTimeAsMillis(company, dateFrom, dateTo);

            long meetingsDuration = 0;

            for(Meeting meeting : meetingsInThisPeriod){
                meetingsDuration += (meeting.getEndTime().getTime() - meeting.getStartTime().getTime());
            }
            return (double)(meetingsDuration*100)/companyWorkTime;
        }else
            throw new BadRequestException(badRequestNoRoom);
    }
}
