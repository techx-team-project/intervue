package com.techx.intervue.modules.connect.repositories;

import com.techx.intervue.modules.connect.entities.ConnectMute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectMuteRepository extends JpaRepository<ConnectMute, Long> {}
