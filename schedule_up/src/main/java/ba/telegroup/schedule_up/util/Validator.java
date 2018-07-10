package ba.telegroup.schedule_up.util;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Validator {

    /*
        Metoda vraca true ako je lozinka duzine 8 ili vise karaktera, sadrzi velika i mala slova, brojeve i specijalne karaktere, u suprotnom false
    */
    public static Boolean passwordChecking(String password) {
        if (password != null){
            String regex = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(password);

            return matcher.matches();
        }
        return true;
    }

    /*
        Metoda vraca true ako je pin duzine tacno cetiri karaktere i sadrzi samo brojeve, u suprotnom false
    */
    public static Boolean pinChecking(String pin) {
        if(pin != null){
            String regex = "[0-9]{4}";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(pin);

            return pin.length() == 4 && matcher.matches();
        }
        return true;
    }

    /*
        Metoda vraca true ako je duzina teksta jednaka vrijednosti length, u suprotnom false
    */
    public static Boolean stringLength(String text, Integer length) {
        if (text != null)
            return Integer.valueOf(text.length()).equals(length);
        return true;
    }

    /*
        Metoda vraca true ako je duzina teksta manja ili jednaka vrijednosti maxLength, u suprotnom false
    */
    public static Boolean stringMaxLength(String text, Integer maxLength) {
        if (text != null)
            return Integer.valueOf(text.length()).compareTo(maxLength) <= 0;
        return true;
    }

    /*
        Metoda vraca true ako je duzina niza bajtova jednaka vrijednosti length, u suprotnom false
        Ako je tip u bazi LONGBLOB, za length se koristi vrijednost longblob.length iz application.properties
     */
    public static Boolean binaryMaxLength(byte[] bytes, Long maxLength) {
        if (bytes != null)
            return Long.valueOf(bytes.length).compareTo(maxLength) <= 0;
        return true;
    }

    /*
        Metoda vraca true ako je broj nenegativan, u suprotnom false
     */
    public static Boolean integerNotNegative(Integer number) {
        if (number != null)
            return number.compareTo(0) >= 0;
        return true;
    }

    /*
       Metoda vraca true ako je broj nenegativan, u suprotnom false
    */
    public static Boolean doubleNotNegative(Double number) {

        if (number != null)
            return number.compareTo(0.0) >= 0;
        return true;
    }

    /*
        Metoda vraca -1 ako je date1 prije date2, 1 ako je date1 poslije date2, a 0 ako su vrijednosti jednake, u suprotnom null
    */
    public static Integer dateCompare(Date date1, Date date2) {
        if (date1 != null && date2 != null) {
            return date1.compareTo(date2);
        }

        return null;
    }

    /*
        Metoda vraca -1 ako je timestamp1 prije timestamp2, 1 ako je timestamp1 poslije timestamp2, a 0 ako su vrijednosti jednake, u suprotnom null
    */
    public static Integer timestampCompare(Timestamp timestamp1, Timestamp timestamp2) {
        if (timestamp1 != null && timestamp2 != null) {
            return timestamp1.compareTo(timestamp2);
        }

        return null;
    }

    /*
        Metoda vraca -1 ako je time1 prije time2, 1 ako je time1 poslije time2, 0 ako su vrijednosti jednake, u suprotnom null
    */
    public static Integer timeCompare(Time time1, Time time2) {
        if (time1 != null && time2 != null) {
            return time1.compareTo(time2);
        }

        return null;
    }

    /*
        Metoda vraca true ako je email validna, u suprotnom false
    */
    public static Boolean validateEmail(String email) {
        if (email != null) {
            String regex = "^[\\w-\\+]+(\\.[\\w]+)*@[\\w-]+(\\.[\\w]+)*(\\.[a-z]{2,})$";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(email);

            return matcher.matches();
        }

        return true;
    }
}
