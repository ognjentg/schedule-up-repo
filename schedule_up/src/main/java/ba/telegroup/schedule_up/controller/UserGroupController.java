package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.UserGroup;
import ba.telegroup.schedule_up.repository.UserGroupRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping(value="/user-group")
@Controller
@Scope("request")
public class UserGroupController extends GenericController<UserGroup, Integer> {
    public UserGroupController(JpaRepository<UserGroup, Integer> repo) {
        super(repo);
    }

    @RequestMapping(value = {"/"}, method = RequestMethod.GET)
    public @ResponseBody
    List<UserGroup> getByCompanyId() {
        return ((UserGroupRepository)repo).getAllByCompanyIdAndDeletedEquals(userBean.getUser().getCompanyId(), (byte) 0);
    }


    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        UserGroup userGroup=((UserGroupRepository) repo).findById(id).orElse(null);
        userGroup.setDeleted((byte)1);
        if (((UserGroupRepository) repo).saveAndFlush(userGroup) != null) {
            logDeleteAction(userGroup);
            return "Success";
        }
        else {
            throw new BadRequestException("Bad request");
        }
    }
}
