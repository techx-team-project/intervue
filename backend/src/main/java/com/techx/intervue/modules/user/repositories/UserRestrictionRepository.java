package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.UserRestriction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRestrictionRepository extends JpaRepository<UserRestriction, Long> {}
