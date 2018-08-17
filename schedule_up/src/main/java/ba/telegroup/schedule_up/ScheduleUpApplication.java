package ba.telegroup.schedule_up;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ServletComponentScan
@EnableConfigurationProperties
@EnableScheduling
public class ScheduleUpApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScheduleUpApplication.class, args);
    }
}
