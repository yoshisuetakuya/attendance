package com.example.attendance_back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_back.service.SystemService;

@RestController
public class SystemController {
	@Autowired
    private SystemService systemService;

    @GetMapping("/getYearMonth")
    public String getYearMonth() {
        return systemService.getYearMonth();
    }

}
