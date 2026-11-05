package com.techx.intervue.controllers;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class BaseController {

    protected <T> ResponseEntity<ApiResource<T>> ok(T data, String message) {
        return ResponseEntity.ok(ApiResource.success(data, message));
    }

    protected <T> ResponseEntity<ApiResource<T>> created(T data, String message) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResource.success(data, message));
    }

    protected <T> ResponseEntity<ApiResource<PageResource<T>>> page(Page<T> page, String message) {
        return ok(PageResource.of(page), message);
    }

    protected RequestActor actor(CustomUserDetails principal, HttpServletRequest request) {
        return new RequestActor(
                principal.getId(), principal.getEmail(), IpHelper.getClientIp(request));
    }
}
