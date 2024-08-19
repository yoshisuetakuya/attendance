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
 *         新規ユーザーの登録を行うサービスクラス
 */
@Service
public class CreateUserService {
	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	/**
	 * 新規ユーザーを登録するメソッド
	 *
	 * @param employeeDto
	 */
	public void registerUser(EmployeeDto employeeDto) {
		// パスワードの暗号化
		String encodedPassword = passwordEncoder.encode(employeeDto.getPassword());
		employeeDto.setPassword(encodedPassword);
		// 新規ユーザー情報を保存
		employeeRepository.save(employeeDto);
	}

	/**
     * 指定されたメールアドレスが既に存在するかを確認するメソッド
     *
     * @param email
     * @return true: メールアドレスが存在する / false: 存在しない
     */
    public boolean isEmailAlreadyRegistered(String email) {
        return employeeRepository.findByEmail(email) != null;
    }

}
