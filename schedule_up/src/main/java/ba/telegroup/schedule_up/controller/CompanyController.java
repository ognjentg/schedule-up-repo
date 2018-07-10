package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.interaction.Notification;
import ba.telegroup.schedule_up.model.Company;
import ba.telegroup.schedule_up.model.Note;
import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.model.modelCustom.CompanyUser;
import ba.telegroup.schedule_up.repository.CompanyRepository;
import ba.telegroup.schedule_up.repository.UserRepository;
import ba.telegroup.schedule_up.util.Util;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Objects;

@RequestMapping(value = "/company")
@Controller
@Scope("request")
public class CompanyController extends GenericController<Company, Integer> {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private static final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm:ss");

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${randomString.length}")
    private Integer randomStringLength;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Value("${badRequest.delete}")
    private String badRequestDelete;

    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;

    @Value("${badRequest.dateTimeCompare}")
    private String badRequestDateTimeCompare;

    @Value("${badRequest.binaryLength}")
    private String badRequestBinaryLength;

    @Value("${badRequest.validateEmail}")
    private String badRequestValidateEmail;

    @Value("${longblob.length}")
    private Long longblobLength;

    public CompanyController(CompanyRepository repo, UserRepository userRepository) {
        super(repo);
        this.companyRepository = repo;
        this.userRepository = userRepository;
    }

    /*
    Vraca sve custom CompanyUser objekte
     */

    @Override
    public List getAll() {
        return companyRepository.getAllExtended();
    }


    /*
    Vraca sve custom ComanyUser objekte gdje id predstavlja id User-a
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody
    CompanyUser findById(@PathVariable Integer id) {
        return companyRepository.getAllExtendedById(id);
    }

    /*
    Vraca sve custom ComanyUser objekte ciji naziv kompanije sadrzi naziv teksta kojeg smo proslijedili
     */
    @RequestMapping(value = "/custom/{name}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllExtendedByNameContains(@PathVariable String name) {
        return companyRepository.getAllExtendedByNameContains(name);
    }

    //Ovo je metoda za insert CompanyUser
    @Transactional
    @RequestMapping(value = "/custom", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    CompanyUser insertExtended(@RequestBody CompanyUser companyUser) throws BadRequestException {
        if (Validator.stringMaxLength(companyUser.getName(), 100)) {
            if(Validator.timeCompare(companyUser.getTimeFrom(), companyUser.getTimeTo()) < 0){
                if(Validator.binaryMaxLength(companyUser.getCompanyLogo(), longblobLength)){
                    if(Validator.validateEmail(companyUser.getEmail())){
                        Company company = new Company();
                        company.setId(null);
                        company.setName(companyUser.getName());
                        company.setTimeTo(companyUser.getTimeTo());
                        company.setTimeFrom(companyUser.getTimeFrom());
                        company.setDeleted((byte) 0);
                        if(repo.saveAndFlush(company) != null){
                            entityManager.refresh(company);
                            logCreateAction(company);

                            String randomToken = Util.randomString(randomStringLength);
                            User user = new User();
                            user.setActive((byte) 0);
                            user.setUsername(null);
                            user.setCompanyId(company.getId());
                            user.setDeactivationReason(null);
                            user.setDeleted((byte) 0);
                            user.setEmail(companyUser.getEmail());
                            user.setFirstName(null);
                            user.setLastName(null);
                            user.setPassword(null);
                            user.setToken(randomToken);
                            user.setTokenTime(new Timestamp(System.currentTimeMillis()));
                            user.setId(null);
                            user.setPhoto(null);
                            user.setPin(null);
                            user.setRoleId(2);

                            if(userRepository.saveAndFlush(user) != null){
                                Notification.sendRegistrationLink(companyUser.getEmail().trim(), "http://127.0.0.1:8020/user/registration/" + randomToken);
                                companyUser.setId(company.getId());

                                return companyUser;
                            }
                            throw new BadRequestException(badRequestInsert);
                        }
                        throw new BadRequestException(badRequestInsert);
                    }
                    throw new BadRequestException(badRequestValidateEmail);
                }
                throw new BadRequestException(badRequestBinaryLength.replace("{tekst}", "slike za logo"));
            }
            throw new BadRequestException(badRequestDateTimeCompare.replace("{date1}", simpleDateFormat.format(companyUser.getTimeFrom())).replace("{prijePoslije}", "prije").replace("{date2}", simpleDateFormat.format(companyUser.getTimeTo())));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
    }

    /*
    Metoda kojom se azurira objekat klase CompanyUser
    Ukoliko se izmijeni email adresa administratoru, setuje mu se flag active na 0
    Path varijabla id se odnosi na id korisnika
    */

    @Transactional
    @RequestMapping(value = "/custom/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    CompanyUser updateExtended(@PathVariable Integer id, @RequestBody CompanyUser companyUser) throws BadRequestException {
        if (Validator.stringMaxLength(companyUser.getName(), 100)) {
            if(Validator.timeCompare(companyUser.getTimeFrom(), companyUser.getTimeTo()) <= 0){
                if(Validator.binaryMaxLength(companyUser.getCompanyLogo(), longblobLength)){
                    if(Validator.validateEmail(companyUser.getEmail())){
                        Company company = companyRepository.findById(id).orElse(null);
                        User adminUser = userRepository.getByCompanyIdAndRoleIdAndActiveAndDeleted(Objects.requireNonNull(company).getId(), 2, (byte) 1, (byte) 0);
                        Company oldObject = cloner.deepClone(company);

                        company.setName(companyUser.getName());
                        company.setTimeFrom(companyUser.getTimeFrom());
                        company.setTimeTo(companyUser.getTimeTo());
                        company.setCompanyLogo(companyUser.getCompanyLogo());
                        if(repo.saveAndFlush(company) != null){
                            entityManager.refresh(company);
                            logUpdateAction(company, oldObject);
                            if (adminUser != null && !companyUser.getEmail().equals(adminUser.getEmail())) {
                                adminUser.setActive((byte) 0);
                                if(userRepository.saveAndFlush(adminUser) != null){
                                    String randomToken = Util.randomString(randomStringLength);
                                    User newAdminUser = new User();
                                    newAdminUser.setId(null);
                                    newAdminUser.setActive((byte) 0);
                                    newAdminUser.setCompanyId(company.getId());
                                    newAdminUser.setDeactivationReason(null);
                                    newAdminUser.setDeleted((byte) 0);
                                    newAdminUser.setEmail(companyUser.getEmail());
                                    newAdminUser.setFirstName(null);
                                    newAdminUser.setLastName(null);
                                    newAdminUser.setPassword(null);
                                    newAdminUser.setId(null);
                                    newAdminUser.setToken(randomToken);
                                    newAdminUser.setTokenTime(new Timestamp(System.currentTimeMillis()));
                                    newAdminUser.setPhoto(null);
                                    newAdminUser.setPin(null);
                                    newAdminUser.setRoleId(2);

                                    if(userRepository.saveAndFlush(newAdminUser) != null){
                                        Notification.sendRegistrationLink(companyUser.getEmail().trim(), "http://127.0.0.1:8020/user/registration/" + randomToken);

                                        return companyUser;
                                    }
                                    throw new BadRequestException(badRequestUpdate);
                                }
                                throw new BadRequestException(badRequestUpdate);
                            }

                            return companyUser;
                        }
                        throw new BadRequestException(badRequestUpdate);
                    }
                    throw new BadRequestException(badRequestValidateEmail);
                }
                throw new BadRequestException(badRequestBinaryLength.replace("{tekst}", "slike za logo"));
            }
            throw new BadRequestException(badRequestDateTimeCompare.replace("{date1}", simpleDateFormat.format(companyUser.getTimeFrom())).replace("{prijePoslije}", "prije").replace("{date2}", simpleDateFormat.format(companyUser.getTimeTo())));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(100)));
    }


    /*
    Metoda za brisanje kompanije(setuje se flag deleted na 1)
    Nakon sto se izbrise kompanija, svakom korisniku koji je vezan za tu
    kompaniju se setuje flag active na 0
    (ne smije se desiti da bude aktivan korisnik ukoliko je kompanija obrisana)
     */
    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        Company company = repo.findById(id).orElse(null);
        cloner.deepClone(company);
        Objects.requireNonNull(company).setDeleted((byte) 1);
        if (companyRepository.deleteCompany(company) != null) {
            logDeleteAction(company);
            return "Success";
        }
        throw new BadRequestException(badRequestDelete);
    }
}
