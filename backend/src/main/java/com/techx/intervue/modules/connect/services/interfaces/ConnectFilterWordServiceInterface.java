package com.techx.intervue.modules.connect.services.interfaces;

import com.techx.intervue.modules.connect.enums.ConnectFilterSeverity;
import com.techx.intervue.modules.connect.enums.FilterScope;
import com.techx.intervue.modules.connect.requests.CreateFilterWordRequest;
import com.techx.intervue.modules.connect.requests.UpdateFilterWordRequest;
import com.techx.intervue.modules.connect.resources.ConnectFilterWordResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ConnectFilterWordServiceInterface {

    record ActiveFilterWord(String pattern, boolean regex, ConnectFilterSeverity severity) {}

    Page<ConnectFilterWordResource> list(FilterScope scope, Pageable pageable);

    List<ActiveFilterWord> activeWords(FilterScope scope);

    ConnectFilterWordResource create(CreateFilterWordRequest request);

    ConnectFilterWordResource update(Long id, UpdateFilterWordRequest request);

    void delete(Long id);

    ConnectFilterWordResource toggleActive(Long id);
}
