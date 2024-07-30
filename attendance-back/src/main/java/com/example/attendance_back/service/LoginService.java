package com.example.attendance_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.repository.EmployeeRepository;

@Service
public class LoginService implements UserDetailsService { // UserDetailsServiceインターフェースを実装
	@Autowired
    private EmployeeRepository EmployeeRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException { // メールアドレスでユーザーを探す
		EmployeeDto employee = EmployeeRepository.findByEmail(email);
		if (employee == null) {
			throw new UsernameNotFoundException("not found : " + email);
		}
		return  new LoginUserDetails(employee);
	}

}
