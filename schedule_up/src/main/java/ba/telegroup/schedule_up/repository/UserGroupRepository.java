package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserGroupRepository extends JpaRepository<UserGroup, Integer> {
    List<UserGroup> getAllByCompanyIdAndDeletedEquals(Integer companyId, Byte deleted);
}
