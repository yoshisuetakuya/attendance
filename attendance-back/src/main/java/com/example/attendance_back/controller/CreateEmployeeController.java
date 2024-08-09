package com.example.attendance_back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.service.CreateUserService;

/**
 *
 * @author 芳末拓也
 *
 *         ユーザーの新規登録を行うコントローラクラス
 *
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class CreateEmployeeController {

	@Autowired
	private CreateUserService createUserService;

	/**
	 * 新規ユーザーを登録するメソッド
	 *
	 * @param employeeDto
	 *
	 */
	@PostMapping("/createUser")
	public void registerUser(@RequestBody EmployeeDto employeeDto) {
		createUserService.registerUser(employeeDto);
	}

}
