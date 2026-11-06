package com.techx.intervue.modules.notification.services.impl;

import com.techx.intervue.modules.notification.entities.NotificationPreference;
import com.techx.intervue.modules.notification.enums.NotificationCategory;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.repositories.NotificationPreferenceRepository;
import com.techx.intervue.modules.notification.requests.UpdatePreferencesRequest;
import com.techx.intervue.modules.notification.resources.NotificationPreferenceResource;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPreferenceServiceInterface;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationPreferenceService implements NotificationPreferenceServiceInterface {

    private static final Set<NotificationCategory> CONFIGURABLE = configurableCategories();
    private static final Set<NotificationCategory> LOCKED = lockedCategories();

    private final NotificationPreferenceRepository preferenceRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationPreferenceResource> findAll(
            RecipientType recipientType, Long recipientId) {
        Map<NotificationCategory, NotificationPreference> stored =
                storedByCategory(recipientType, recipientId);
        return CONFIGURABLE.stream().map(category -> toResource(category, stored)).toList();
    }

    @Override
    @Transactional
    public List<NotificationPreferenceResource> update(
            RecipientType recipientType, Long recipientId, UpdatePreferencesRequest request) {
        Map<NotificationCategory, NotificationPreference> stored =
                storedByCategory(recipientType, recipientId);

        for (UpdatePreferencesRequest.Entry entry : request.preferences()) {
            if (!CONFIGURABLE.contains(entry.category()) || LOCKED.contains(entry.category())) {
                continue;
            }
            NotificationPreference preference =
                    stored.computeIfAbsent(
                            entry.category(),
                            category ->
                                    NotificationPreference.builder()
                                            .recipientType(recipientType)
                                            .recipientId(recipientId)
                                            .category(category)
                                            .build());
            preference.setInApp(entry.inApp());
            preference.setEmail(entry.email());
            preferenceRepository.save(preference);
        }

        return CONFIGURABLE.stream().map(category -> toResource(category, stored)).toList();
    }

    private Map<NotificationCategory, NotificationPreference> storedByCategory(
            RecipientType recipientType, Long recipientId) {
        return preferenceRepository
                .findByRecipientTypeAndRecipientId(recipientType, recipientId)
                .stream()
                .collect(
                        Collectors.toMap(
                                NotificationPreference::getCategory,
                                Function.identity(),
                                (first, second) -> first,
                                () -> new java.util.EnumMap<>(NotificationCategory.class)));
    }

    private NotificationPreferenceResource toResource(
            NotificationCategory category,
            Map<NotificationCategory, NotificationPreference> stored) {
        boolean locked = LOCKED.contains(category);
        NotificationPreference preference = stored.get(category);
        boolean inApp = locked || preference == null || preference.isInApp();
        boolean email = locked || preference == null || preference.isEmail();
        return new NotificationPreferenceResource(category, inApp, email, locked);
    }

    private static Set<NotificationCategory> configurableCategories() {
        return Arrays.stream(NotificationType.values())
                .map(NotificationType::getCategory)
                .collect(Collectors.toCollection(() -> EnumSet.noneOf(NotificationCategory.class)));
    }

    // A category is locked only when every notification in it is mandatory, so a user can never
    // silence security or account alerts.
    private static Set<NotificationCategory> lockedCategories() {
        return configurableCategories().stream()
                .filter(
                        category ->
                                Arrays.stream(NotificationType.values())
                                        .filter(type -> type.getCategory() == category)
                                        .allMatch(NotificationType::isMandatory))
                .collect(Collectors.toCollection(() -> EnumSet.noneOf(NotificationCategory.class)));
    }
}
