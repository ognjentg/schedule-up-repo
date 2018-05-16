package ba.telegroup.schedule_up.repository;

import ba.telegroup.schedule_up.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
