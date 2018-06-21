package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.repository.repositoryCustom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer>, UserRepositoryCustom {

    User getByUsername(String username);
    User getByToken(String token);
}
