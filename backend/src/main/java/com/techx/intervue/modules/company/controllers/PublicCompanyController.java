package com.techx.intervue.modules.company.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.company.resources.PublicCompanyResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.resources.ApiResource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class PublicCompanyController extends BaseController {

    private final CompanyServiceInterface companyService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<PublicCompanyResource>> detail(@PathVariable Long id) {
        return ok(companyService.findPublic(id), "Company retrieved successfully!");
    }
}
