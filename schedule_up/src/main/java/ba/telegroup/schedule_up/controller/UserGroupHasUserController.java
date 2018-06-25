package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.UserGroupHasUser;
import ba.telegroup.schedule_up.model.UserGroupHasUserPK;
import ba.telegroup.schedule_up.repository.UserGroupHasUserRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@RequestMapping(value = "/user-group-has-user")
@Controller
@Scope("request")
public class UserGroupHasUserController extends GenericController<UserGroupHasUser, UserGroupHasUserPK> {

    private final UserGroupHasUserRepository userGroupHasUserRepository;

    public UserGroupHasUserController(UserGroupHasUserRepository repo) {
        super(repo);
        this.userGroupHasUserRepository = repo;
    }

    @SuppressWarnings("SameReturnValue")
    @RequestMapping(value = {"/{groupId}/{userId}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer groupId, @PathVariable Integer userId) throws BadRequestException {
        UserGroupHasUserPK userGroupHasUserPK = new UserGroupHasUserPK();
        userGroupHasUserPK.setUserGroupId(groupId);
        userGroupHasUserPK.setUserId(userId);
        UserGroupHasUser userGroupHasUser = repo.findById(userGroupHasUserPK).orElse(null);
        if (userGroupHasUser != null) {
            repo.delete(userGroupHasUser);
            logDeleteAction(userGroupHasUser);
            return "Success";
        }
        throw new BadRequestException("Bad Request");
    }

}
