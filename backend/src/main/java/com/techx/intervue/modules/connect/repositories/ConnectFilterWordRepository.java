package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectFilterWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectFilterWordRepository extends JpaRepository<ConnectFilterWord, Long> {}
