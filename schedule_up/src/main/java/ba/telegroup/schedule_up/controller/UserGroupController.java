package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.UserGroup;
import ba.telegroup.schedule_up.repository.UserGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RequestMapping(value = "/user-group")
@Controller
@Scope("request")
public class UserGroupController extends GenericController<UserGroup, Integer> {
    private final UserGroupRepository usergroupRepository;

    @Autowired
    public UserGroupController(UserGroupRepository repo) {
        super(repo);
        this.usergroupRepository = repo;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<UserGroup> getAll() {
        return usergroupRepository.getAllByCompanyIdAndDeletedEquals(userBean.getUser().getCompanyId(), (byte) 0);
    }


    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) {
        UserGroup userGroup = repo.findById(id).orElse(null);
        Objects.requireNonNull(userGroup).setDeleted((byte) 1);
        repo.saveAndFlush(userGroup);
        logDeleteAction(userGroup);
        return "Success";
    }

    @Override
    @Transactional
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String update(@PathVariable Integer id, @RequestBody UserGroup object) throws BadRequestException, ForbiddenException {
        return super.update(id, object);
    }

    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    UserGroup insert(@RequestBody UserGroup object) throws BadRequestException, ForbiddenException {
        return super.insert(object);
    }
}
