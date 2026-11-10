package com.techx.intervue.modules.connect.services.interfaces;

import com.techx.intervue.modules.connect.requests.CreateFilterWordRequest;
import com.techx.intervue.modules.connect.requests.UpdateFilterWordRequest;
import com.techx.intervue.modules.connect.resources.ConnectFilterWordResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ConnectFilterWordServiceInterface {

    Page<ConnectFilterWordResource> list(Pageable pageable);

    ConnectFilterWordResource create(CreateFilterWordRequest request);

    ConnectFilterWordResource update(Long id, UpdateFilterWordRequest request);

    void delete(Long id);

    ConnectFilterWordResource toggleActive(Long id);
}
