package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.modelCustom.RoomBuilding;

import java.util.List;

public interface RoomRepositoryCustom {

    List getAllExtendedByCompanyId(Integer id);
}
