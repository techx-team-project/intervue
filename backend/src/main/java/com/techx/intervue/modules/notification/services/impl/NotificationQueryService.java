package com.techx.intervue.modules.notification.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.notification.entities.NotificationRecipient;
import com.techx.intervue.modules.notification.enums.NotificationCategory;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.mappers.NotificationMapper;
import com.techx.intervue.modules.notification.repositories.NotificationRecipientRepository;
import com.techx.intervue.modules.notification.repositories.NotificationRecipientRepository.UnreadCategoryCount;
import com.techx.intervue.modules.notification.requests.SearchNotificationRequest;
import com.techx.intervue.modules.notification.resources.NotificationDetailResource;
import com.techx.intervue.modules.notification.resources.NotificationListResource;
import com.techx.intervue.modules.notification.resources.UnreadCountResource;
import com.techx.intervue.modules.notification.services.interfaces.NotificationQueryServiceInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationUnreadCacheInterface;
import com.techx.intervue.modules.notification.specifications.NotificationRecipientSpecifications;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationQueryService implements NotificationQueryServiceInterface {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");
    private static final Sort TIE_BREAKER = Sort.by(Sort.Direction.DESC, "id");

    private final NotificationRecipientRepository recipientRepository;
    private final NotificationMapper notificationMapper;
    private final NotificationUnreadCacheInterface unreadCache;

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationListResource> search(
            RecipientType recipientType,
            Long recipientId,
            SearchNotificationRequest request,
            Pageable pageable) {
        Specification<NotificationRecipient> spec =
                NotificationRecipientSpecifications.inbox(recipientType, recipientId, request);
        return recipientRepository
                .findAll(spec, withStableOrder(pageable))
                .map(notificationMapper::toListResource);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationDetailResource getDetail(
            RecipientType recipientType, Long recipientId, Long recipientRowId) {
        return recipientRepository
                .findByIdAndRecipientTypeAndRecipientId(recipientRowId, recipientType, recipientId)
                .map(notificationMapper::toDetailResource)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public UnreadCountResource unreadCount(RecipientType recipientType, Long recipientId) {
        List<UnreadCategoryCount> counts =
                recipientRepository.countUnreadByCategory(recipientType, recipientId);

        Map<NotificationCategory, Long> byCategory = new EnumMap<>(NotificationCategory.class);
        long total = 0;
        for (UnreadCategoryCount count : counts) {
            byCategory.put(count.getCategory(), count.getTotal());
            total += count.getTotal();
        }

        unreadCache.set(recipientType, recipientId, total);
        return new UnreadCountResource(total, byCategory);
    }

    private Pageable withStableOrder(Pageable pageable) {
        Sort requested = pageable.getSort().isSorted() ? pageable.getSort() : DEFAULT_SORT;
        return PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), requested.and(TIE_BREAKER));
    }
}
