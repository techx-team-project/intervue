package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.CompanySearchResult;
import java.util.List;

public interface CompanySearchServiceInterface {

    List<CompanySearchResult> search(String keyword, String industry, String location, int limit);
}
