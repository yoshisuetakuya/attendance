package com.example.attendance_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.repository.EmployeeRepository;

@Service
public class CreateUserService {
	@Autowired
    private EmployeeRepository employeeRepository;

	 @Autowired
	    private PasswordEncoder passwordEncoder;

	 public void registerUser(EmployeeDto employeeDto) {
	        // パスワードの暗号化
	        String encodedPassword = passwordEncoder.encode(employeeDto.getPassword());
	        employeeDto.setPassword(encodedPassword);
	        // 新規ユーザー情報を保存
	        employeeRepository.save(employeeDto);
	    }

}
