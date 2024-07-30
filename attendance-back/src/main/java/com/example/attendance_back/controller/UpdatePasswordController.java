package com.example.attendance_back.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_back.service.PasswordUpdateService;

@RestController
public class UpdatePasswordController {
	@Autowired
	private PasswordUpdateService passwordUpdateService;


	@PostMapping("/updatePassword")
	public String requestPasswordReset(@RequestBody Map<String, String> requestBody) {
		String currentPassword = requestBody.get("currentPassword");
		String newPassword = requestBody.get("newPassword");
		// 現在の認証ユーザーを取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // 現在のユーザーのメールアドレス
		boolean isUpdated = passwordUpdateService.updatePassword(email, currentPassword, newPassword);
		;
		if (isUpdated) {
			return "パスワードを更新しました";
		} else {
			return "パスワードを更新できませんでした";
		}
	}

}
