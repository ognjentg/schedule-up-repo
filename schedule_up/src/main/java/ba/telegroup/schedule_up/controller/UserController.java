package ba.telegroup.schedule_up.controller;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericController.GenericController;
import ba.telegroup.schedule_up.model.User;
import ba.telegroup.schedule_up.util.LoginInformation;
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

    private static final String SQL_SELECT_USER_ID_BY_USERNAME = "SELECT id FROM user WHERE username=? AND active=true AND deleted=false";
    private static final String SQL_SELECT_COMPANY_NAME_BY_COMPANY_ID = "SELECT name FROM company WHERE id=? AND deleted=false";
    @PersistenceContext
    private EntityManager entityManager;

    public UserController(JpaRepository<User, Integer> repo) { super(repo); }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody
    User login(@RequestBody LoginInformation loginInformation) {

        List<Integer> userId = (List<Integer>) entityManager.createNativeQuery(SQL_SELECT_USER_ID_BY_USERNAME).setParameter(1, loginInformation.getUsername().trim()).getResultList();
        User user = null;
        if(userId != null && !userId.isEmpty()){
            user = entityManager.find(User.class, userId.get(0));
        }
        if(user != null && Integer.valueOf(1).equals(user.getRoleId())){
            if(Util.checkPassword(loginInformation.getPassword().trim(), new String(user.getPassword()))){
                user.setPassword(null);
                userBean.setUser(user);
                userBean.setLoggedIn(true);

                return userBean.getUser();
            }
            else{
                return null;
            }
        }
        else{
            List<String> companyName = (List<String>) entityManager.createNativeQuery(SQL_SELECT_COMPANY_NAME_BY_COMPANY_ID).setParameter(1, user.getCompanyId()).getResultList();
            if(companyName != null && companyName.get(0).equals(loginInformation.getCompanyName().trim()) && Util.checkPassword(loginInformation.getPassword().trim(), new String(user.getPassword()))){
                user.setPassword(null);
                userBean.setUser(user);
                userBean.setLoggedIn(true);

                return userBean.getUser();
            }
            else{
                return null;
            }
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
