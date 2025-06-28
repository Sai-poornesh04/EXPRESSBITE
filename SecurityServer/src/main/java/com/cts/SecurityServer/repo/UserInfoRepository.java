package com.cts.SecurityServer.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cts.SecurityServer.entity.UserInfo;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findByName(String username);
     Optional<UserInfo> findByEmail(String userEmail);

}
