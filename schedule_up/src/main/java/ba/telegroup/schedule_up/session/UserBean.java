package ba.telegroup.schedule_up.session;


import ba.telegroup.schedule_up.model.User;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("session")
public class UserBean {
    private User user;
    private Boolean loggedIn;

    // Don't do this. This is made for purpose of starting this project.
    // Must change this as soon as possible.

    public UserBean() {
        user = new User();
        loggedIn = true;
        user.setId(1);
        user.setCompanyId(1);
        user.setRoleId(1);
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Boolean getLoggedIn() {
        return loggedIn;
    }

    public void setLoggedIn(Boolean loggedIn) {
        this.loggedIn = loggedIn;
    }
}
