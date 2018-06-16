package ba.telegroup.schedule_up.util;

public class LoginInformation {
    private String username;
    private String password;
    private String companyName;

    public LoginInformation(){}

    public LoginInformation(String username, String password, String companyName) {
        this.username = username;
        this.password = password;
        this.companyName = companyName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
