package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.repository.repositoryCustom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer>, UserRepositoryCustom {

    User getByCompanyIdAndRoleIdAndActiveAndDeleted(Integer companyId, Integer roleId, byte active, byte deleted);

    User getByUsername(String username);

    User getByToken(String token);

    List<User> getAllByCompanyIdAndActive(Integer companyId, byte active);

    User getById(Integer id);

    User getByUsernameAndCompanyId(String username, Integer companyId);

    Integer countAllByCompanyIdAndEmail(Integer companyId, String email);
}
