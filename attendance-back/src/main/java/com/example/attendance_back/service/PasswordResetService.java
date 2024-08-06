package com.example.attendance_back.service;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.repository.EmployeeRepository;

/**
 *
 * @author 芳末拓也
 *
 *         パスワードをリセットしてメールを送るサービスクラス
 */
@Service
public class PasswordResetService {
	@Autowired
	private EmployeeRepository employeeRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
//	@Autowired
//	private EmailService emailService;

	/**
	 * 指定されたメールアドレスのユーザーのパスワードをリセットするメソッド
	 *
	 * @param email
	 */
	public void resetPassword(String email) {
		// メールアドレスからユーザー情報を取得
		EmployeeDto employee = employeeRepository.findByEmail(email);
		// ユーザーが存在する場合
		if (employee != null) {
			// ランダムな新しいパスワードを生成
			String newPassword = generateRandomPassword();
			// 新しいパスワードをエンコードしてユーザーに設定
			employee.setPassword(passwordEncoder.encode(newPassword));
			// 更新されたユーザー情報を保存
			employeeRepository.save(employee);

			// 新しいパスワードをメールで送信
			// 実際にメールを送る機能を使う際にここのコメントアウトを外す
//			emailService.sendPasswordResetEmail(email, newPassword);

		}

	}

	/**
	 * ランダムなパスワードを生成するメソッド
	 *
	 * @return ランダムなパスワード
	 */
	private String generateRandomPassword() {
		SecureRandom random = new SecureRandom();
		byte[] data = new byte[8];
		random.nextBytes(data);
		// バイト配列をBase64エンコードし文字列として返す
		return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
	}

}
