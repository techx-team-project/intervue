package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.entities.Interview;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class InterviewIcsBuilder {

    private static final DateTimeFormatter STAMP =
            DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'").withZone(ZoneOffset.UTC);
    private static final String LINE_BREAK = "\r\n";

    public byte[] build(Interview interview, Application application) {
        Instant end = interview.getStartsAt().plusSeconds(interview.getDurationMinutes() * 60L);
        List<String> lines =
                List.of(
                        "BEGIN:VCALENDAR",
                        "VERSION:2.0",
                        "PRODID:-//InterVue//Interview//EN",
                        "CALSCALE:GREGORIAN",
                        "METHOD:PUBLISH",
                        "BEGIN:VEVENT",
                        "UID:interview-" + interview.getId() + "@intervue",
                        "DTSTAMP:" + STAMP.format(Instant.now()),
                        "DTSTART:" + STAMP.format(interview.getStartsAt()),
                        "DTEND:" + STAMP.format(end),
                        "SUMMARY:"
                                + escape(
                                        "Interview: "
                                                + application.getJobTitle()
                                                + " at "
                                                + application.getCompanyName()),
                        "LOCATION:" + escape(interview.getLocation()),
                        "DESCRIPTION:" + escape(descriptionOf(interview)),
                        "END:VEVENT",
                        "END:VCALENDAR");
        return (String.join(LINE_BREAK, lines) + LINE_BREAK).getBytes(StandardCharsets.UTF_8);
    }

    private String descriptionOf(Interview interview) {
        return interview.getNote() == null ? "InterVue interview" : interview.getNote();
    }

    private String escape(String value) {
        return value.replace("\\", "\\\\")
                .replace(";", "\\;")
                .replace(",", "\\,")
                .replace("\r", "")
                .replace("\n", "\\n");
    }
}
