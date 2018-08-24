package ba.telegroup.schedule_up.interaction;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import org.springframework.scheduling.annotation.Async;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Properties;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

public class Notification {

    private static final String SENDER_MAIL;
    private static final String PASSWORD;

    static {
        ResourceBundle propertyResourceBundle = PropertyResourceBundle.getBundle("mail");
        SENDER_MAIL = propertyResourceBundle.getString("SENDER_MAIL");
        PASSWORD = propertyResourceBundle.getString("PASSWORD");
    }

    private static Properties getTLSSetProperty() {
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.socketFactory.port", "465");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "465");
        properties.put("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");
        return properties;
    }

    @Async
    public void notify(String recipientMail, String messageText) throws BadRequestException {
        Properties properties = getTLSSetProperty();

        Session session = Session.getDefaultInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SENDER_MAIL, PASSWORD);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SENDER_MAIL, "TeleGroup ScheduleUp"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientMail));
            message.setSubject("Notification");
            message.setText(messageText);

            Transport.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new BadRequestException("Recipient mail not found.");
        }
    }

    @Async
    public void notifyAll(List<String> recipientMail, String messageText) throws BadRequestException {
        Properties properties = getTLSSetProperty();


        Session session = Session.getDefaultInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SENDER_MAIL, PASSWORD);
            }
        });

        try {
            InternetAddress[] recipientAddresses=new InternetAddress[recipientMail.size()];
            int counter=0;
            for(String mail:recipientMail){
                recipientAddresses[counter++]=new InternetAddress(mail);
            }
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SENDER_MAIL, "TeleGroup ScheduleUp"));
            message.setRecipients(Message.RecipientType.TO, recipientAddresses);
            message.setSubject("Notification");
            message.setText(messageText);

            Transport.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new BadRequestException("Recipient mail not found.");
        }
    }

    public static void sendRegistrationLink(String recipientMail, String registrationToken) throws BadRequestException {
        Properties properties = getTLSSetProperty();

        Session session = Session.getDefaultInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SENDER_MAIL, PASSWORD);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SENDER_MAIL, "TeleGroup ScheduleUp"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientMail));
            message.setSubject("Registration");
            message.setText("Registraciju možete izvršiti na slijedećem linku http://localhost:8020 klikom na dugme registraciju. Vaš token je " + registrationToken + ".");

            Transport.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new BadRequestException("Recipient mail not found.");
        }
    }

    public static void sendNewPassword(String recipientMail, String newPassword) throws BadRequestException {
        Properties properties = getTLSSetProperty();

        Session session = Session.getDefaultInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SENDER_MAIL, PASSWORD);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SENDER_MAIL, "TeleGroup ScheduleUp"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientMail));
            message.setSubject("Registration");
            message.setText("Vaša nova lozinka je " + newPassword + ". Molimo Vas da odmah poslije prvog prijavljivanja na sistem promijenite lozinku.");

            Transport.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new BadRequestException("Recipient mail not found.");
        }
    }

}
