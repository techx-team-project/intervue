package com.techx.intervue.modules.company.services.interfaces;

import com.techx.intervue.modules.company.requests.RevokeMembershipRequest;
import com.techx.intervue.modules.company.requests.TransferCompanyOwnerRequest;
import com.techx.intervue.modules.company.resources.CompanyMemberResource;
import java.util.List;

public interface CompanyAdminServiceInterface {

    List<CompanyMemberResource> findMembers(Long companyId);

    List<CompanyMemberResource> revokeMembership(
            Long companyId, Long userId, RevokeMembershipRequest request, AdminActor actor);

    List<CompanyMemberResource> transferOwner(
            Long companyId, TransferCompanyOwnerRequest request, AdminActor actor);
}
