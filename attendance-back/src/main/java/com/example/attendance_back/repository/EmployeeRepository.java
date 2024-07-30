package com.example.attendance_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.attendance_back.dto.EmployeeDto;

public interface EmployeeRepository extends JpaRepository<EmployeeDto, Integer> {
	EmployeeDto  findByEmail(String email);
}
