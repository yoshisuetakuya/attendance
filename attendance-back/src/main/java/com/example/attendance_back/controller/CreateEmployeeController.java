package com.example.attendance_back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RestController
public class CreateEmployeeController {

	@Autowired
	private CreateUserService createUserService;

	/**
     * 新規ユーザーを登録するメソッド
     *
     * @param employeeDto
     * @return ResponseEntity
     */
    @PostMapping("/createUser")
    public ResponseEntity<String> registerUser(@RequestBody EmployeeDto employeeDto) {
        // 既に登録されているメールアドレスか確認
        if (createUserService.isEmailAlreadyRegistered(employeeDto.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("このメールアドレスはすでに登録されています");
        }

        // 新規ユーザー登録
        createUserService.registerUser(employeeDto);
        return ResponseEntity.status(HttpStatus.OK).body("登録に成功しました");
    }

}
