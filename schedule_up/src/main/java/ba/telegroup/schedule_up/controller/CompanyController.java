package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.Company;
import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;
import ba.telegroup.schedule_up.repository.CompanyRepository;
import ba.telegroup.schedule_up.repository.repositoryCustom.CompanyRepositoryCustom;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value = "/company")
@Controller
@Scope("request")
public class CompanyController extends GenericController<Company, Integer> {


    public CompanyController(JpaRepository<Company, Integer> repo) {
        super(repo);
    }

    /*
    Vraca sve custom CompanyUser objekte
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public @ResponseBody
    List<CompanyUser> getAllExtended() {
        return ((CompanyRepositoryCustom) repo).getAllExtended();
    }

    /*
    Vraca sve custom ComanyUser objekte na osnovnu id-a kompanije(id Company i company_id User-a moraju biti isti)
     */
    @RequestMapping(value = "/getAllExtendedById/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllExtendedById(@PathVariable Integer id) {
        return ((CompanyRepositoryCustom) repo).getAllExtendedById(id);
    }

    /*
    Vraca sve custom ComanyUser objekte ciji naziv kompanije sadrzi naziv teksta kojeg smo unijeli
     */
    @RequestMapping(value = "/getAllExtendedByNameContains/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllExtendedByNameContains(@PathVariable String name) {
        return ((CompanyRepositoryCustom) repo).getAllExtendedByNameContains(name);
    }

    /*
    Vraca sve custom ComanyUser objekte na osnovu id kompanije i emaila user-a
     */
    @RequestMapping(value = "/getByIdAndEmail/{id}/{email}", method = RequestMethod.GET)
    public @ResponseBody
    CompanyUser getByIdAndEmail(@PathVariable Integer id, @PathVariable String email) {
        return ((CompanyRepositoryCustom) repo).getByIdAndEmail(id, email);
    }

    @Transactional
    @RequestMapping(value ="/", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    CompanyUser insertExtended(@RequestBody CompanyUser companyUser) throws BadRequestException {
        return  ((CompanyRepositoryCustom)repo).insertExtended(companyUser);
    }

    /*
    Metoda kojom se azurira objekat klase CompanyUser
    Ukoliko se izmijeni email adresa administratoru, setuje mu se flag active na 0
    Path varijabla id se odnosi na id korisnika
    */
    @Transactional
    @RequestMapping(value ="/custom/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    CompanyUser updateExtended(@PathVariable Integer id, @RequestBody CompanyUser companyUser) throws BadRequestException {
        System.out.println("Ulazi");
        return  ((CompanyRepositoryCustom)repo).updateExtended(id, companyUser);
    }


    /*
    Metoda za brisanje kompanije(setuje se flag deleted na 1)
    Nakon sto se izbrise kompanija, svakom administratoru koji je vezan za tu
    kompaniju se setuje flag active na 0
    (ne smije se desiti da bude aktivan administrator ukoliko je kompanija izbrisana)
     */
    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody String delete(@PathVariable Integer id) throws BadRequestException {
        Company company=((CompanyRepository) repo).findById(id).orElse(null);
        Company oldObject = cloner.deepClone(company);
        company.setDeleted((byte)1);
        if ("Success".equals(((CompanyRepositoryCustom) repo).deleteCompany(company))) {
            logUpdateAction(company, oldObject);
            return "Success";
        }
        throw new BadRequestException("Bad request");
    }

}
