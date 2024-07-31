package com.example.attendance_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.attendance_back.dto.SystemDto;

public interface SystemRepository extends JpaRepository<SystemDto, Integer>{
	@Query("SELECT TO_CHAR(s.editingperiod, 'YYYYMM') FROM SystemDto s WHERE s.systemid = 1")
    String getYearMonth();

}
