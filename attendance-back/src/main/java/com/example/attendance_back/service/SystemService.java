package com.example.attendance_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.attendance_back.repository.SystemRepository;

@Service
public class SystemService {
	  @Autowired
	    private SystemRepository systemRepository;

	    public String getEdithingPeriod() {
	        return systemRepository.getEdithingPeriod();
	    }

}
