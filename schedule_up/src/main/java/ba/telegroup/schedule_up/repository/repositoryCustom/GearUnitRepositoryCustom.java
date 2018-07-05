package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.modelCustom.GearUnitGear;
import java.util.List;

public interface GearUnitRepositoryCustom {

    List<GearUnitGear> getAllExtendedByCompanyId(Integer id);
    List<GearUnitGear> getAllExtendedById(Integer id);
    List<GearUnitGear> getAllExtendedByRoomId(Integer companyid, Integer roomId);
    GearUnitGear insertExtended(GearUnitGear gearUnitGear);
    GearUnitGear updateExtended(GearUnitGear gearUnitGear);

}
