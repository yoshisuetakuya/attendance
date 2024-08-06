package com.example.attendance_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.attendance_back.dto.AttendanceDto;

/**
 *
 * @author 芳末拓也
 *
 *         attendanceテーブルを操作するリポジトリクラス
 *
 */
public interface AttendanceRepository extends JpaRepository<AttendanceDto, Integer> {
	/**
	 * 従業員IDと年月に基づいて出勤データのリストを取得するメソッド
	 *
	 * @param employeeid
	 * @param year
	 * @param month
	 * @return 指定された条件に一致する出勤データのリスト
	 */
	List<AttendanceDto> findByEmployeeidAndYearAndMonth(Integer employeeid, Integer year, Integer month);

	/**
	 * 指定された従業員IDと年月日に基づいて単一の出勤データを取得するメソッド
	 *
	 * @param employeeid
	 * @param year
	 * @param month
	 * @param day
	 * @return 指定された条件に一致する出勤データ
	 */
	AttendanceDto findByEmployeeidAndYearAndMonthAndDay(Integer employeeid, Integer year, Integer month, Integer day);
}
