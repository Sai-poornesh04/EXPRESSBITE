package com.cts.SecurityServer.config;

import com.cts.SecurityServer.entity.UserInfo;
import com.cts.SecurityServer.repo.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserInfoUserDetailsService implements UserDetailsService {

    @Autowired
    private UserInfoRepository repository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<UserInfo> userInfo = repository.findByEmail(email.toLowerCase());

        return userInfo.map(UserInfoUserDetails::new)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
