package com.example.attendance_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.repository.EmployeeRepository;

@Service
public class PasswordUpdateService {
	@Autowired
	private EmployeeRepository employeeRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	public boolean updatePassword(String email, String currentPassword, String newPassword) {
		 EmployeeDto employee = employeeRepository.findByEmail(email);
        if (employee != null && passwordEncoder.matches(currentPassword, employee.getPassword())) {
            employee.setPassword(passwordEncoder.encode(newPassword));
            employeeRepository.save(employee);
            return true;
        }
        return false;
    }

}
