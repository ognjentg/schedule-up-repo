package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Company;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/company")
@Controller
@Scope("request")
public class CompanyController extends GenericController<Company,Integer> {


    public CompanyController(JpaRepository<Company, Integer> repo) {
        super(repo);
    }
}
