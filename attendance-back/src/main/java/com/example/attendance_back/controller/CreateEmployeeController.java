package com.example.attendance_back.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
public class CreateEmployeeController {

	 @Autowired
	    private CreateUserService createUserService;

	 @PostMapping("/createUser")
	    public String registerUser(@RequestBody EmployeeDto employeeDto) {
		 createUserService.registerUser(employeeDto);
	        return ("新規ユーザーが登録されました");
	    }
	 //　ユーザー情報を確認するためのAPI
	 @GetMapping("/user")
	    public String getUserInfo() {
	        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	        if (auth != null) {
	            LoginUserDetails userDetails = (LoginUserDetails) auth.getPrincipal();
	            return ("名前: " + userDetails.getName()+" Email: " + userDetails.getUsername()+" パスワード: " + userDetails.getPassword());
	        }
	        return "ユーザーが見つかりませんでした";
	    }


}
