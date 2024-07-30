package com.example.attendance_back.service;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.repository.EmployeeRepository;

@Service
public class PasswordResetService {
	@Autowired
	private EmployeeRepository employeeRepository; // ユーザー情報を扱うリポジトリ
	@Autowired
	private PasswordEncoder passwordEncoder; // パスワードの暗号化

	public boolean resetPassword(String email) {
		EmployeeDto employee = employeeRepository.findByEmail(email);
		if (employee != null) {
			String newPassword = generateRandomPassword();
			employee.setPassword(passwordEncoder.encode(newPassword));
			employeeRepository.save(employee);

			// メールの代わりにコンソールにメッセージを表示
			System.out.println("Password reset for " + email);
			System.out.println("New password: " + newPassword);

			return true;
		}
		return false;
	}

	private String generateRandomPassword() {
		SecureRandom random = new SecureRandom();
		byte[] bytes = new byte[8]; // ランダムなバイトデータ
		random.nextBytes(bytes);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
	}

}
