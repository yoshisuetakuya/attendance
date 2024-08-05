package com.example.attendance_back.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_back.service.PasswordUpdateService;

/**
 *
 * @author 芳末拓也
 *
 *         ユーザーのパスワードを更新するコントローラクラス
 *
 */
@RestController
public class UpdatePasswordController {
	@Autowired
	private PasswordUpdateService passwordUpdateService;

	/**
	 * 現在のユーザーのパスワードを更新するメソッド
	 *
	 * @param requestBody
	 */
	@PostMapping("/updatePassword")
	public void requestPasswordReset(@RequestBody Map<String, String> requestBody) {
		String currentPassword = requestBody.get("currentPassword");
		String newPassword = requestBody.get("newPassword");
		// 現在の認証ユーザーを取得
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		// 現在のユーザーのメールアドレスを取得
		String email = authentication.getName();
		passwordUpdateService.updatePassword(email, currentPassword, newPassword);
	}

}
