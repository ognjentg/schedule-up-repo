package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {

    User getByCompanyIdAndRoleIdAndActiveAndDeleted(Integer companyId, Integer roleId, byte active, byte deleted);
    User getByUsername(String username);
    User getByToken(String token);
    List<User> getAllByCompanyId(Integer companyId);
}
