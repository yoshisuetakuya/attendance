package com.example.attendance_back.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
	 * @return ResponseEntity
	 */
	 @PostMapping("/reissue")
	    public ResponseEntity<String> requestPasswordReset(@RequestBody Map<String, String> requestBody) {
	        String email = requestBody.get("email");

	        if (passwordResetService.resetPassword(email)) {
	            return ResponseEntity.ok("パスワードの再発行リクエストに成功しました");
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("指定されたメールアドレスは登録されていません");
	        }
	    }

}
