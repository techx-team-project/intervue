package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.services.interfaces.SmallTalkServiceInterface;
import java.text.Normalizer;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class SmallTalkService implements SmallTalkServiceInterface {

    private static final int MAX_MESSAGE_LENGTH = 50;
    private static final Pattern DIACRITICS = Pattern.compile("\\p{M}+");
    private static final Pattern SEPARATORS = Pattern.compile("[^a-z0-9]+");
    private static final Pattern REPEATED_CHARS = Pattern.compile("(.)\\1+");

    private static final String GREETING_VI =
            "Xin chào! Mình là trợ lý InterVue. Mình có thể giúp bạn tìm việc làm, tra cứu doanh nghiệp, xem hồ sơ ứng tuyển hoặc hướng dẫn cách dùng nền tảng. Bạn cần hỗ trợ gì?";
    private static final String GREETING_EN =
            "Hello! I'm the InterVue assistant. I can help you find jobs, look up companies, check your applications or explain how to use the platform. What can I help you with?";
    private static final String THANKS_VI =
            "Rất vui được hỗ trợ bạn! Nếu cần thêm gì, cứ hỏi mình nhé.";
    private static final String THANKS_EN =
            "You're welcome! Let me know if you need anything else.";
    private static final String GOODBYE_VI = "Tạm biệt bạn! Chúc bạn tìm được công việc ưng ý.";
    private static final String GOODBYE_EN = "Goodbye! Good luck with your job search.";

    private record Rule(Set<String> phrases, String reply) {

        static Rule of(String reply, String... phrases) {
            return new Rule(
                    Arrays.stream(phrases)
                            .map(SmallTalkService::normalize)
                            .collect(Collectors.toUnmodifiableSet()),
                    reply);
        }
    }

    private static final List<Rule> RULES =
            List.of(
                    Rule.of(
                            GREETING_VI,
                            "xin chào",
                            "chào",
                            "chào bạn",
                            "chào bot",
                            "xin chào bạn",
                            "xin chào bot",
                            "alo",
                            "hi bạn",
                            "hi bot",
                            "hello bạn",
                            "hello bot"),
                    Rule.of(
                            GREETING_EN,
                            "hi",
                            "hello",
                            "hey",
                            "hi there",
                            "hello there",
                            "hey there",
                            "good morning",
                            "good afternoon",
                            "good evening"),
                    Rule.of(
                            THANKS_VI,
                            "cảm ơn",
                            "cảm ơn bạn",
                            "cảm ơn bot",
                            "cảm ơn nhiều",
                            "cảm ơn nhé",
                            "cảm ơn nha",
                            "thanks bạn"),
                    Rule.of(
                            THANKS_EN,
                            "thanks",
                            "thank you",
                            "thank you so much",
                            "thanks a lot",
                            "thx"),
                    Rule.of(GOODBYE_VI, "tạm biệt", "tạm biệt bạn", "hẹn gặp lại"),
                    Rule.of(GOODBYE_EN, "bye", "goodbye", "see you", "see you later"));

    @Override
    public Optional<String> reply(String message) {
        if (message == null || message.length() > MAX_MESSAGE_LENGTH) {
            return Optional.empty();
        }
        String normalized = normalize(message);
        return RULES.stream()
                .filter(rule -> rule.phrases().contains(normalized))
                .findFirst()
                .map(Rule::reply);
    }

    // Lower-case, strip accents and punctuation, and squash repeated letters so "Hiii!" matches
    // "hi".
    private static String normalize(String text) {
        String stripped =
                DIACRITICS
                        .matcher(
                                Normalizer.normalize(
                                        text.toLowerCase(Locale.ROOT), Normalizer.Form.NFD))
                        .replaceAll("")
                        .replace('đ', 'd');
        String words = SEPARATORS.matcher(stripped).replaceAll(" ").trim();
        return REPEATED_CHARS.matcher(words).replaceAll("$1");
    }
}
