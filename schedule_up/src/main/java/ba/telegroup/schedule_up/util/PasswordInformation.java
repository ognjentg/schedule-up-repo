package ba.telegroup.schedule_up.util;

public class PasswordInformation {
    private String oldPassword;
    private String newPassword;
    private String repeatedNewPassword;

    public PasswordInformation(){}

    public PasswordInformation(String oldPassword, String newPassword, String repeatedNewPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.repeatedNewPassword = repeatedNewPassword;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getRepeatedNewPassword() {
        return repeatedNewPassword;
    }

    public void setRepeatedNewPassword(String repeatedNewPassword) {
        this.repeatedNewPassword = repeatedNewPassword;
    }
}
