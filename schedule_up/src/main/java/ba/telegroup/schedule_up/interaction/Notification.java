package ba.telegroup.schedule_up.interaction;

import ba.telegroup.schedule_up.common.exceptions.BadRequestException;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

public class Notification {

    private static final String SENDER_MAIL = "telegrouptestmail@gmail.com";
    private static final String PASSWORD = "123456789!a";

    private static Properties getTLSSetProperty() {
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");
        return properties;
    }

    public static void notify(String recipientMail, String messageText) throws BadRequestException{

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

}
