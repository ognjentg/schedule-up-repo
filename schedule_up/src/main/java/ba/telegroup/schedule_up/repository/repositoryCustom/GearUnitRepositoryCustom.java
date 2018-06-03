package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.modelCustom.GearUnitGear;
import java.util.List;

public interface GearUnitRepositoryCustom {

    List<GearUnitGear> getAllExtendedByCompanyId(Integer id);
    List<GearUnitGear> getAllExtendedById(Integer id);
    GearUnitGear insertExtended(GearUnitGear gearUnitGear);
    GearUnitGear updateExtended(GearUnitGear gearUnitGear);

}
