package ba.telegroup.schedule_up.util;

import java.sql.Time;

public class Validator {

    /*
    Metoda vraca true ako je duzina teksta jednaka vrijednosti length, u suprotnom false
     */
    public static Boolean stringLength(String text, Integer length) {
        return text != null && length != null && Integer.valueOf(text.length()).equals(length);
    }

    /*
    Metoda vraca true ako je duzina niza bajtova jednaka vrijednosti length, u suprotnom false
     */
    public static Boolean binaryLength(byte[] bytes, Integer length) {
        return bytes != null && length != null && Integer.valueOf(bytes.length).equals(length);
    }

    /*
    Metoda vraca true ako je broj nenegativan, u suprotnom false
     */
    public static Boolean integerNotNegative(Integer number) {
        return number != null && number.compareTo(0) >= 0;
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
}
