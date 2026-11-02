package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.SearchUsersRequest;
import com.techx.intervue.modules.user.resources.AdminUserDetailResource;
import com.techx.intervue.modules.user.resources.AdminUserListResource;
import com.techx.intervue.modules.user.resources.AdminUserSummaryResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserAdminServiceInterface {

    Page<AdminUserListResource> search(SearchUsersRequest request, Pageable pageable);

    AdminUserDetailResource findDetail(Long userId);

    AdminUserSummaryResource summarise();
}
