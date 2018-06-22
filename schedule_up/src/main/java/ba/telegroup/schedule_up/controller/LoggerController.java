package ba.telegroup.schedule_up.controller;


import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Logger;
import ba.telegroup.schedule_up.repository.LoggerRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.LoggerRepositoryCustom;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@RequestMapping(value = "/logger")
@Controller
@Scope("request")
public class LoggerController extends GenericController<Logger, Integer> {

    private final LoggerRepository loggerRepository;

    public LoggerController(LoggerRepository loggerRepository) {
        super(loggerRepository);
        this.loggerRepository = loggerRepository;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll() {
        return loggerRepository.getAllExtendedByCompanyId(userBean.getUser().getCompanyId());
    }

}
