package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectionMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectionMessageRepository extends JpaRepository<ConnectionMessage, Long> {}
