package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.util.Util;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@RequestMapping(value = "/user")
@Controller
@Scope("request")
public class UserController extends GenericController<User, Integer> {

    private static final String SQL_LOGIN = "SELECT u.id FROM user u JOIN company c ON u.company_id=c.id WHERE u.username=? AND c.name=? AND u.active=true AND u.deleted=false";
    @PersistenceContext
    private EntityManager entityManager;

    public UserController(JpaRepository<User, Integer> repo) { super(repo); }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody
    User login(@RequestParam("username") String username, @RequestParam("password") String password, @RequestParam("company_name") String companyName) {

        List<Integer> userId = (List<Integer>) entityManager.createNativeQuery(SQL_LOGIN).setParameter(1, username.trim()).setParameter(2, companyName.trim()).getResultList();
        User user = null;
        if(userId != null && !userId.isEmpty()){
            user = entityManager.find(User.class, userId.get(0));
        }

        if(user != null && Util.checkPassword(password.trim(), new String(user.getPassword()))){
            user.setPassword(null);
            userBean.setUser(user);
            userBean.setLoggedIn(true);

            return userBean.getUser();
        }
        else{
            return null;
        }
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public @ResponseBody
    String logout() throws BadRequestException {
        try{
            userBean.setUser(new User());
            userBean.setLoggedIn(false);

            return "Success";
        } catch(Exception ex){
            ex.printStackTrace();
            throw new BadRequestException("Bad Request");
        }
    }
}
