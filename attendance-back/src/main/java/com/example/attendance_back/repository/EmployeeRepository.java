package com.example.attendance_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.attendance_back.dto.EmployeeDto;

/**
 *
 * @author 芳末拓也
 *
 *         employeeテーブルを操作するためのリポジトリクラス
 */
public interface EmployeeRepository extends JpaRepository<EmployeeDto, String> {
	/**
	 * 指定されたメールアドレスに基づいて従業員データを取得するメソッド
	 *
	 * @param email
	 * @return 指定されたメールアドレスに一致する従業員データ
	 */
	EmployeeDto findByEmail(String email);
}
