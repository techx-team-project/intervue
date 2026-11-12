package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectFilterWord;
import com.techx.intervue.modules.connect.enums.FilterScope;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectFilterWordRepository extends JpaRepository<ConnectFilterWord, Long> {

    List<ConnectFilterWord> findByActiveTrueAndScope(FilterScope scope);

    Page<ConnectFilterWord> findByScope(FilterScope scope, Pageable pageable);
}
