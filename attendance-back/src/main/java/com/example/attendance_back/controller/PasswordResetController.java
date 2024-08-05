package com.example.attendance_back.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_back.service.PasswordResetService;

/**
 *
 * @author 芳末拓也
 *
 *         パスワードリセットをするコントローラクラス
 */
@RestController
public class PasswordResetController {

	@Autowired
	private PasswordResetService passwordResetService;

	/**
	 * パスワードリセットを行うメソッド
	 *
	 * @param requestBody
	 */
	@PostMapping("/reissue")
	public void requestPasswordReset(@RequestBody Map<String, String> requestBody) {
		String email = requestBody.get("email");
		passwordResetService.resetPassword(email);
	}

}
