package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdminBusinessVerificationDetailResource(
        BusinessDocumentResource document,
        AdminCompanyFactsResource company,
        CompanyMemberResource submitter,
        List<CompanyMemberResource> members,
        List<BusinessDocumentResource> companyDocuments) {}
