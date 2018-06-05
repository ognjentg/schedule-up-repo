package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
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

    @Override
    public List getAll() throws BadRequestException, ForbiddenException {
        return ((CompanyRepositoryCustom) repo).getAllExtended();
    }


    /*
    Vraca sve custom ComanyUser objekte gdje id predstavlja id User-a
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody
    CompanyUser findById(@PathVariable Integer id) {
        return ((CompanyRepositoryCustom) repo).getAllExtendedById(id);
    }

    /*
    Vraca sve custom ComanyUser objekte ciji naziv kompanije sadrzi naziv teksta kojeg smo proslijedili
     */
    @RequestMapping(value = "/custom/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllExtendedByNameContains(@PathVariable String name) {
        return ((CompanyRepositoryCustom) repo).getAllExtendedByNameContains(name);
    }

    //Ovo je metoda za insert CompanyUser
    @Transactional
    @RequestMapping(value ="/insert", method = RequestMethod.POST)
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
        return  ((CompanyRepositoryCustom)repo).updateExtended(id, companyUser);
    }


    /*
    Metoda za brisanje kompanije(setuje se flag deleted na 1)
    Nakon sto se izbrise kompanija, svakom korisniku koji je vezan za tu
    kompaniju se setuje flag active na 0
    (ne smije se desiti da bude aktivan korisnik ukoliko je kompanija obrisana)
     */
    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody String delete(@PathVariable Integer id) throws BadRequestException {
        Company company=((CompanyRepository) repo).findById(id).orElse(null);
        Company oldObject = cloner.deepClone(company);
        company.setDeleted((byte)1);
        if (((CompanyRepositoryCustom) repo).deleteCompany(company) != null) {
            logDeleteAction(company);
            return "Success";
        }
        throw new BadRequestException("Bad request");
    }

}
