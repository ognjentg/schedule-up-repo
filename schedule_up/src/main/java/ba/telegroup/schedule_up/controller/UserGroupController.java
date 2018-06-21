package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.UserGroup;
import ba.telegroup.schedule_up.repository.UserGroupRepository;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping(value="/user-group")
@Controller
@Scope("request")
public class UserGroupController extends GenericController<UserGroup, Integer> {
    public UserGroupController(JpaRepository<UserGroup, Integer> repo) {
        super(repo);
    }

    @RequestMapping(method = RequestMethod.GET)
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

    @Override
    @Transactional
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String update(@PathVariable Integer id,@RequestBody  UserGroup object) throws BadRequestException, ForbiddenException {
        return super.update(id, object);
    }

    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody UserGroup insert(@RequestBody UserGroup object) throws BadRequestException, ForbiddenException {
        return super.insert(object);
    }
}
