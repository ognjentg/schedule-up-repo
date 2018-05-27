package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.Gear;
import ba.telegroup.schedule_up.model.modelCustom.GearUnitGear;

import java.util.List;

public interface GearUnitRepositoryCustom {

    List<GearUnitGear> getAllExtended();

}
