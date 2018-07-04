package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.interaction.Notification;
import ba.telegroup.schedule_up.model.Participant;
import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.repository.CompanyRepository;
import ba.telegroup.schedule_up.repository.ParticipantRepository;
import ba.telegroup.schedule_up.repository.UserRepository;
import ba.telegroup.schedule_up.util.LoginInformation;
import ba.telegroup.schedule_up.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
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

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${randomString.length}")
    private Integer randomStringLength;

    @Autowired
    public UserController(UserRepository repo, CompanyRepository companyRepository, ParticipantRepository participantRepository) {
        super(repo);
        this.userRepository = repo;
        this.companyRepository = companyRepository;
        this.participantRepository = participantRepository;
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
            throw new BadRequestException("Bad request");
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
    public @ResponseBody
    String invitationToRegistration(@RequestParam("mail") String mail, @RequestParam("role") Integer roleId, @RequestParam("company") Integer companyId) throws BadRequestException {
        try {
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
            repo.saveAndFlush(newUser);

            Notification.sendRegistrationLink(mail.trim(), "http://127.0.0.1:8020/user/registration/" + randomToken);

            return "Success";
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new BadRequestException("Bad Request");
        }
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
        try {
            User user = entityManager.find(User.class, newUser.getId());
            user.setUsername(newUser.getUsername());
            user.setPassword(newUser.getPassword());
            user.setFirstName(newUser.getFirstName());
            user.setLastName(newUser.getLastName());
            user.setPhoto(newUser.getPhoto());
            user.setPin(newUser.getPin());
            user.setActive((byte) 1);

            repo.saveAndFlush(user);

            return "Success";
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new BadRequestException("Bad Request");
        }
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
}
