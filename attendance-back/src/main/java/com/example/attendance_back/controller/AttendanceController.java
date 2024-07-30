package com.example.attendance_back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.service.CreateUserService;
import com.example.attendance_back.service.LoginUserDetails;

@RestController
public class AttendanceController {

	 @Autowired
	    private CreateUserService createUserService;
//	@PostMapping("/login")
//	public String index1 () {
//        return "test";
//    }
//
//	@GetMapping("/test")
//	public String test () {
//        return "test";
//    }
//
//	@GetMapping("/")
//	public String test2 () {
//        return "test2";
//    }

	 @PostMapping("/createUser")
	    public ResponseEntity<String> registerUser(@RequestBody EmployeeDto employeeDto) {
		 createUserService.registerUser(employeeDto);
	        return ResponseEntity.ok("User registered successfully");
	    }
	 //　ユーザー情報を確認するためのAPI
	 @GetMapping("/user")
	    public String getUserInfo() {
	        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	        if (auth != null) {
	            LoginUserDetails userDetails = (LoginUserDetails) auth.getPrincipal();
	            return ("名前: " + userDetails.getName()+" Email: " + userDetails.getUsername()+" パスワード: " + userDetails.getPassword());
	        }
	        return "No user info available";
	    }


}
