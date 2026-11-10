package com.techx.intervue.modules.ads.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.ads.enums.AdCreativeStatus;
import com.techx.intervue.modules.ads.requests.ReviewAdCreativeRequest;
import com.techx.intervue.modules.ads.requests.SaveAdCreativeRequest;
import com.techx.intervue.modules.ads.resources.AdminAdCreativeResource;
import com.techx.intervue.modules.ads.resources.RecruiterAdBookingResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface AdCreativeServiceInterface {

    RecruiterAdBookingResource upload(
            Long bookingId, MultipartFile image, SaveAdCreativeRequest request, Long recruiterId);

    Page<AdminAdCreativeResource> search(AdCreativeStatus status, Pageable pageable);

    AdminAdCreativeResource approve(Long id, RequestActor actor);

    AdminAdCreativeResource reject(Long id, ReviewAdCreativeRequest request, RequestActor actor);
}
