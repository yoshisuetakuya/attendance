package com.example.attendance_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.attendance_back.dto.AttendanceDto;

public interface AttendanceRepository extends JpaRepository<AttendanceDto, Integer> {
    List<AttendanceDto> findByEmployeeidAndYearAndMonth(Integer employeeid, Integer year, Integer month);
    AttendanceDto findByEmployeeidAndYearAndMonthAndDay(Integer employeeid, Integer year, Integer month, Integer day);
}
