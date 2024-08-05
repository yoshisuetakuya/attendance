package com.example.attendance_back.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_back.dto.AttendanceDto;
import com.example.attendance_back.dto.RegisterAttendanceDto;
import com.example.attendance_back.service.AttendanceService;

@RestController
public class AttendanceController {
    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/getAttendance/{year}/{month}")
    public List<AttendanceDto> getAttendance(@PathVariable("year") Integer year, @PathVariable("month") Integer month) {
        return attendanceService.getAttendance(year, month);
    }

    @PostMapping("/register")
    public void registerAttendance(@RequestBody RegisterAttendanceDto registerAttendancedto) {
    	attendanceService.register(registerAttendancedto);
    }
}
