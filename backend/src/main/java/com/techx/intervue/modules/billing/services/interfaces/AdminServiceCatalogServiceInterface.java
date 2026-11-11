package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import com.techx.intervue.modules.billing.requests.AdminSearchServicePackagesRequest;
import com.techx.intervue.modules.billing.requests.ReorderServiceCategoriesRequest;
import com.techx.intervue.modules.billing.requests.SaveServiceCategoryRequest;
import com.techx.intervue.modules.billing.requests.SaveServicePackageRequest;
import com.techx.intervue.modules.billing.resources.AdminServiceCategoryResource;
import com.techx.intervue.modules.billing.resources.AdminServicePackageResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface AdminServiceCatalogServiceInterface {

    List<AdminServiceCategoryResource> listCategories();

    AdminServiceCategoryResource getCategory(Long id);

    AdminServiceCategoryResource createCategory(
            SaveServiceCategoryRequest request, RequestActor actor);

    AdminServiceCategoryResource updateCategory(
            Long id, SaveServiceCategoryRequest request, RequestActor actor);

    AdminServiceCategoryResource setCategoryActive(Long id, boolean active, RequestActor actor);

    List<AdminServiceCategoryResource> reorderCategories(
            ReorderServiceCategoriesRequest request, RequestActor actor);

    void deleteCategory(Long id, RequestActor actor);

    Page<AdminServicePackageResource> searchPackages(
            AdminSearchServicePackagesRequest request, Pageable pageable);

    AdminServicePackageResource getPackage(Long id);

    AdminServicePackageResource createPackage(
            SaveServicePackageRequest request, RequestActor actor);

    AdminServicePackageResource updatePackage(
            Long id, SaveServicePackageRequest request, RequestActor actor);

    AdminServicePackageResource setStatus(Long id, ServicePackageStatus status, RequestActor actor);

    UploadedPackageImageResource uploadPackageImage(MultipartFile file);

    record UploadedPackageImageResource(String url, String publicId) {}
}
