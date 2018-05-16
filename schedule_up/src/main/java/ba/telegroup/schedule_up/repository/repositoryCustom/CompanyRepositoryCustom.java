package ba.telegroup.schedule_up.repository.repositoryCustom;

import java.util.List;

public interface CompanyRepositoryCustom {

    List getAllExtended();

    List getAllExtendedById(Integer id);
}
