package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Company;
import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;
import ba.telegroup.schedule_up.repository.CompanyRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.CompanyRepositoryCustom;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@RequestMapping(value = "/company")
@Controller
@Scope("request")
public class CompanyController extends GenericController<Company, Integer> {
	
    public CompanyController(JpaRepository<Company, Integer> repo) {
        super(repo);
    }
	
    @RequestMapping(value = "/getAllByIdIsAfter/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<Company> getAllByIdIsAfter(@PathVariable Integer id) {
        return ((CompanyRepository) repo).getAllByIdIsAfter(id);
    }

    @RequestMapping(value = "/getAllExtended", method = RequestMethod.GET)
    public @ResponseBody
    List<CompanyUser> getAllExtended() {
        return ((CompanyRepositoryCustom) repo).getAllExtended();
    }

    @RequestMapping(value = "/getAllExtendedById/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllExtendedById(@PathVariable Integer id) {
        return ((CompanyRepositoryCustom) repo).getAllExtendedById(id);
    }
}
