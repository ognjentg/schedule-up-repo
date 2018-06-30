package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.Building;
import ba.telegroup.schedule_up.model.modelCustom.RoomBuilding;
import ba.telegroup.schedule_up.repository.repositoryCustom.RoomRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class RoomRepositoryImpl implements RoomRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED_BY_COMPANY_NAME_WHERE_DELETED_IS_FALSE = "SELECT r.id, r.name, r.floor,r.capacity,r.pin,r.description,r.building_id, r.company_id, b.name, b.longitude, b.latitude FROM room r JOIN building b ON r.building_id=b.id WHERE r.deleted=0 AND b.company_id=?";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List getAllExtendedByCompanyId(Integer id){
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_COMPANY_NAME_WHERE_DELETED_IS_FALSE, "RoomBuildingMapping").setParameter(1, id).getResultList();
    }


}
