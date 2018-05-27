package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;


import ba.telegroup.schedule_up.model.Gear;
import ba.telegroup.schedule_up.model.GearUnit;
import ba.telegroup.schedule_up.model.modelCustom.GearUnitGear;
import ba.telegroup.schedule_up.repository.GearUnitRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.GearUnitRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

public class GearUnitRepositoryImpl implements GearUnitRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT gu.id, gu.available, gu.deleted, gu.description, gu.company_id, gu.gear_id, g.name FROM gear_unit gu JOIN gear g ON g.id=gu.gear_id";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<GearUnitGear> getAllExtended() {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "GearUnitGearMapping").getResultList();
    }

}
