package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.interaction.Notification;
import ba.telegroup.schedule_up.model.*;
import ba.telegroup.schedule_up.repository.*;
import ba.telegroup.schedule_up.util.LoginInformation;
import ba.telegroup.schedule_up.util.Util;
import ba.telegroup.schedule_up.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequestMapping(value = "/user")
@Controller
@Scope("request")
public class UserController extends GenericController<User, Integer> {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ParticipantRepository participantRepository;
    private final UserGroupHasUserRepository userGroupHasUserRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${randomString.length}")
    private Integer randomStringLength;

    @Value("${badRequest.noUser}")
    private String badRequestNoUser;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Value("${badRequest.delete}")
    private String badRequestDelete;

    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;

    @Value("${badRequest.binaryLength}")
    private String badRequestBinaryLength;

    @Value("${badRequest.registration}")
    private String badRequestRegistration;

    @Value("${badRequest.usernameExists}")
    private String badRequestUsernameExists;

    @Value("${badRequest.passwordStrength}")
    private String badRequestPasswordStrength;

    @Value("${badRequest.pinStrength}")
    private String badRequestPinStrength;

    @Value("${longblob.length}")
    private Long longblobLength;

    @Value("${badRequest.validateEmail}")
    private String badRequestValidateEmail;

    @Autowired
    public UserController(UserRepository repo, CompanyRepository companyRepository, ParticipantRepository participantRepository, UserGroupHasUserRepository userGroupHasUserRepository) {
        super(repo);
        this.userRepository = repo;
        this.companyRepository = companyRepository;
        this.participantRepository = participantRepository;
        this.userGroupHasUserRepository = userGroupHasUserRepository;
    }

    @Override
    public @ResponseBody
    List<User> getAll() {
        List<User> users = cloner.deepClone(userRepository.getAllByCompanyIdAndActive(userBean.getUser().getCompanyId(), (byte)1));
        for(User user : users){
            user.setPassword(null);
            user.setPin(null);
        }

        return users;
    }


    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody
    User findById(@PathVariable("id") Integer id) throws BadRequestException {
        User user = userRepository.findById(id).orElse(null);
        if (user != null && Objects.equals(user.getCompanyId(), userBean.getUser().getCompanyId())) {
            user.setPassword(null);
            user.setPin(null);
            return user;
        } else {
            throw new BadRequestException(badRequestNoUser);
        }
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody
    User login(@RequestBody LoginInformation loginInformation) throws ForbiddenException {
        Boolean successLogin = false;
        User user = userRepository.getByUsername(loginInformation.getUsername());
        if (user == null) {
            throw new ForbiddenException("Forbidden");
        }

        if (Integer.valueOf(1).equals(user.getRoleId())) {
            if (user.getPassword().trim().equals(Util.hashPassword(loginInformation.getPassword().trim()))) {
                successLogin = true;
            }
        } else {
            String companyName = companyRepository.getById(user.getCompanyId()).getName();
            if (companyName != null && companyName.equals(loginInformation.getCompanyName().trim()) && user.getPassword().trim().equals(Util.hashPassword(loginInformation.getPassword().trim()))) {
                successLogin = true;
            }
        }

        if (successLogin) {
            user.setPassword(null);
            user.setPin(null);
            userBean.setUser(user);
            userBean.setLoggedIn(true);

            return userBean.getUser();
        } else {
            throw new ForbiddenException("Forbidden");
        }
    }

    @SuppressWarnings("SameReturnValue")
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public @ResponseBody
    String logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        return "Success";
    }

    @SuppressWarnings("SameReturnValue")
    @RequestMapping(value = "/invitationToRegistration", method = RequestMethod.POST)
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    String invitationToRegistration(@RequestParam("mail") String mail, @RequestParam("role") Integer roleId, @RequestParam("company") Integer companyId) throws BadRequestException {
        if(Validator.validateEmail(mail)){
            String randomToken = Util.randomString(randomStringLength);
            User newUser = new User();
            newUser.setEmail(mail);
            newUser.setUsername(null);
            newUser.setPassword(null);
            newUser.setPin(null);
            newUser.setFirstName(null);
            newUser.setLastName(null);
            newUser.setPhoto(null);
            newUser.setActive((byte) 0);
            newUser.setDeleted((byte) 0);
            newUser.setDeactivationReason(null);
            newUser.setToken(randomToken);
            newUser.setTokenTime(new Timestamp(System.currentTimeMillis()));
            newUser.setCompanyId(companyId);
            newUser.setRoleId(roleId);
            if(repo.saveAndFlush(newUser) != null){
                entityManager.refresh(newUser);
                logCreateAction(newUser);
                Notification.sendRegistrationLink(mail.trim(), "http://127.0.0.1:8020/user/registration/" + randomToken);

                return "Success";
            }
            throw new BadRequestException(badRequestInsert);
        }
        throw new BadRequestException(badRequestValidateEmail);
    }

    @RequestMapping(value = "/registration/{token}", method = RequestMethod.GET)
    public @ResponseBody
    User requestForRegistration(@PathVariable String token) {
        User user = userRepository.getByToken(token);
        if (user == null) {
            return null;
        }

        if (new Timestamp(System.currentTimeMillis()).before(new Timestamp(user.getTokenTime().getTime() + 10 * 60 * 1000))) {
            return user;
        } else {
            return null;
        }
    }

    @SuppressWarnings("SameReturnValue")
    @RequestMapping(value = "/registration", method = RequestMethod.POST)
    public @ResponseBody
    String registration(@RequestBody User newUser) throws BadRequestException {
        User userWithUsername = userRepository.getByUsernameAndCompanyId(newUser.getUsername(), newUser.getCompanyId());
        if(userWithUsername == null) {
            if (Validator.stringMaxLength(newUser.getUsername(), 100)) {
                if(Validator.passwordChecking(newUser.getPassword())){
                    if (Validator.stringMaxLength(newUser.getFirstName(), 100)) {
                        if (Validator.stringMaxLength(newUser.getLastName(), 100)) {
                            if(Validator.pinChecking(newUser.getPin())){
                                if(Validator.binaryMaxLength(newUser.getPhoto(), longblobLength)){
                                    User user = entityManager.find(User.class, newUser.getId());
                                    user.setUsername(newUser.getUsername());
                                    user.setPassword(Util.hashPassword(newUser.getPassword()));
                                    user.setToken(null);
                                    user.setTokenTime(null);
                                    user.setFirstName(newUser.getFirstName());
                                    user.setLastName(newUser.getLastName());
                                    user.setPhoto(newUser.getPhoto());
                                    user.setPin(Util.hashPassword(newUser.getPin()));
                                    user.setActive((byte) 1);

                                    if(repo.saveAndFlush(user) != null){
                                        return "Success";
                                    }
                                    throw new BadRequestException(badRequestRegistration);
                                }
                                throw new BadRequestException(badRequestBinaryLength.replace("{tekst}", "slike"));
                            }
                            throw new BadRequestException(badRequestPinStrength);
                        }
                        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "prezimena").replace("{broj}", String.valueOf(100)));
                    }
                    throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "imena").replace("{broj}", String.valueOf(100)));
                }
                throw new BadRequestException(badRequestPasswordStrength);
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "username-a").replace("{broj}", String.valueOf(100)));
        }
        throw new BadRequestException(badRequestUsernameExists);
    }


    @RequestMapping(value = {"/state"}, method = RequestMethod.GET)
    public
    @ResponseBody
    User checkState() throws ForbiddenException {
        System.out.println("LOGGED" + userBean.getLoggedIn() + " user:" + userBean.getUser().getUsername());
        if (userBean.getLoggedIn()) {
            return userBean.getUser();
        } else
            throw new ForbiddenException("Forbidden");
    }

    @Transactional
    @RequestMapping(value = {"/nonParticipantsFor/{meetingId}"}, method = RequestMethod.GET)
    public @ResponseBody
    List<User> getNonParticipants(@PathVariable Integer meetingId) {
        List<User> retValue = getAll();
        retValue.removeAll(userRepository.findAllById(participantRepository.getAllByMeetingIdAndDeletedIs(meetingId, (byte) 0).stream().map(Participant::getUserId).collect(Collectors.toList())));
        return retValue.stream().map(user -> {
            User newUser=new User();
            newUser.setId(user.getId());
            newUser.setFirstName(user.getFirstName());
            newUser.setLastName(user.getLastName());
            return newUser;
        }).collect(Collectors.toList());
    }

    @Transactional
    @RequestMapping(value = {"/participantsFor/{meetingId}"}, method = RequestMethod.GET)
    public @ResponseBody
    List<User> getParticipants(@PathVariable Integer meetingId) {
        return userRepository.findAllById(participantRepository.getAllByMeetingIdAndDeletedIs(meetingId, (byte) 0).stream().map(Participant::getUserId).collect(Collectors.toList()));
    }

    @Transactional
    @RequestMapping(value = {"/nonInGroup"}, method = RequestMethod.GET)
    public @ResponseBody
    List<User> getNonInGroup() {
        List<User> users = cloner.deepClone(userRepository.getNotInGroupByCompanyId(userBean.getUser().getCompanyId()));
        for(User user : users){
            user.setPassword(null);
            user.setPin(null);
        }
        return users;
    }

    @Transactional
    @RequestMapping(value = {"/nonInGroup/{groupId}"}, method = RequestMethod.GET)
    public @ResponseBody
    List<User> getNonInGroupByGroupId(@PathVariable Integer groupId) {
        List<User> users = cloner.deepClone(userRepository.getNotInGroupByCompanyIdAndGroupId(userBean.getUser().getCompanyId(), groupId));
        for(User user : users){
            user.setPassword(null);
            user.setPin(null);
        }
        return users;
    }
}
