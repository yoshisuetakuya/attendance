package com.example.attendance_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.attendance_back.dto.SecurityDto;

public interface SecurityRepository extends JpaRepository<SecurityDto, Integer> {
	 SecurityDto findByEmployeeid(Integer employeeid);
}
