package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.Gear;
import ba.telegroup.schedule_up.model.GearUnit;
import ba.telegroup.schedule_up.model.modelCustom.GearUnitGear;
import ba.telegroup.schedule_up.repository.repositoryCustom.GearUnitRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.PersistenceContext;
import java.util.List;

public class GearUnitRepositoryImpl implements GearUnitRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT gu.id, gu.available, gu.deleted, gu.description, gu.company_id, gu.gear_id, g.name FROM gear_unit gu JOIN gear g ON g.id=gu.gear_id";
    private static final String SQL_GET_ALL_EXTENDED_BY_ID = "SELECT gu.id, gu.available, gu.deleted, gu.description, gu.company_id, gu.gear_id, g.name FROM gear_unit gu JOIN gear g ON g.id=gu.gear_id WHERE gu.id=? AND gu.deleted=0";
    
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private EntityManagerFactory emf;

    @Override
    public List<GearUnitGear> getAllExtended() {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "GearUnitGearMapping").getResultList();
    }

    @Override
    public List<GearUnitGear> getAllExtendedById(Integer id) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_ID,"GearUnitGearMapping").setParameter(1, id).getResultList();
    }

    @Override
    @Transactional
    public GearUnitGear insertExtended(GearUnitGear gearUnitGear) {

            EntityManager entityManager1 = emf.createEntityManager();
            EntityTransaction transaction = entityManager1.getTransaction();
            transaction.begin();
            if(gearUnitGear.getGearId()==null) {
                Gear gear = new Gear();
                gear.setName(gearUnitGear.getName());
                entityManager1.persist(gear);
                gearUnitGear.setGearId(gear.getId());
            }
            GearUnit gearUnit = new GearUnit();
            gearUnit.setGearId(gearUnitGear.getGearId());
            gearUnit.setDeleted(gearUnitGear.getDeleted());
            gearUnit.setAvailable(gearUnitGear.getAvailable());
            gearUnit.setCompanyId(gearUnitGear.getCompanyId());
            gearUnit.setDescription(gearUnitGear.getDescription());

            entityManager1.persist(gearUnit);

            gearUnitGear.setId(gearUnit.getId());
            transaction.commit();
            entityManager1.close();

            return gearUnitGear;

    }

    @Override
    @Transactional
    public GearUnitGear updateExtended(GearUnitGear gearUnitGear) {

        EntityManager entityManager1 = emf.createEntityManager();
        EntityTransaction transaction = entityManager1.getTransaction();
        transaction.begin();
        if(gearUnitGear.getGearId()==null) {
            Gear gear = new Gear();
            gear.setName(gearUnitGear.getName());
            entityManager1.persist(gear);
            gearUnitGear.setGearId(gear.getId());
        }
        GearUnit gearUnit=new GearUnit();
        gearUnit.setId(gearUnitGear.getId());
        gearUnit = entityManager1.find(GearUnit.class, gearUnit.getId());
        gearUnit.setGearId(gearUnitGear.getGearId());
        gearUnit.setDeleted(gearUnitGear.getDeleted());
        gearUnit.setAvailable(gearUnitGear.getAvailable());
        gearUnit.setCompanyId(gearUnitGear.getCompanyId());
        gearUnit.setDescription(gearUnitGear.getDescription());

        transaction.commit();
        entityManager1.close();
        return gearUnitGear;

    }

}
