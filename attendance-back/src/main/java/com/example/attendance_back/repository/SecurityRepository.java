package com.example.attendance_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.attendance_back.dto.SecurityDto;

/**
 *
 * @author cyber
 *
 *         securityクラスを操作するためのリポジトリクラス
 */
public interface SecurityRepository extends JpaRepository<SecurityDto, Integer> {
	/**
	 * 指定された従業員IDに基づいてセキュリティ情報を取得する
	 *
	 * @param employeeid
	 * @return 指定した従業員IDに一致するセキュリティデータ
	 */
	SecurityDto findByEmployeeid(Integer employeeid);
}
