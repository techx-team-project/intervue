package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.modules.billing.resources.ServiceCatalogResource;
import com.techx.intervue.modules.billing.resources.ServicePackageDetailResource;

public interface ServiceCatalogServiceInterface {

    ServiceCatalogResource getCatalog();

    ServicePackageDetailResource getBySlug(String slug);
}
