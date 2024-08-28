package com.example.attendance_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.repository.EmployeeRepository;

/**
 *
 * @author 芳末拓也
 *
 *         パスワードの更新を行うサービスクラス
 */
@Service
public class PasswordUpdateService {
	@Autowired
	private EmployeeRepository employeeRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	/**
	 * ユーザーのパスワードを更新するメソッド
	 *
	 * @param email
	 * @param currentPassword
	 * @param newPassword
	 */
	public void updatePassword(String email, String currentPassword, String newPassword) {
		// 指定されたメールアドレスでユーザーを検索
		EmployeeDto employee = employeeRepository.findByEmail(email);
		if (employee == null) {
			// メールアドレスが見つからない場合のエラー
			throw new IllegalArgumentException("メールアドレスが見つかりませんでした");
		}

		// 現在のパスワードが保存されたパスワードと一致するか確認
		if (!passwordEncoder.matches(currentPassword, employee.getPassword())) {
			// 現在のパスワードが一致しない場合のエラー
			throw new IllegalArgumentException("現在のパスワードが見つかりませんでした");
		}

		// 新しいパスワードをエンコードして保存
		employee.setPassword(passwordEncoder.encode(newPassword));
		employeeRepository.save(employee);

	}

}
