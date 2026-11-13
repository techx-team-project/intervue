package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.resources.AdminJobInsightsResource;

public interface AdminJobInsightsServiceInterface {

    AdminJobInsightsResource insights(int days);
}
