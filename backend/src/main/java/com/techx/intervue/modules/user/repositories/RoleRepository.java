package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.Role;
import com.techx.intervue.modules.user.enums.RoleType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}
