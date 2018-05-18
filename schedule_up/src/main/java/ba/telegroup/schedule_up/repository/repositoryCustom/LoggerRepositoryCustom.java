package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;
import ba.telegroup.schedule_up.model.modelCustom.LoggerUser;

import java.util.List;

public interface LoggerRepositoryCustom {

    List<LoggerUser> getAllExtended();
}
