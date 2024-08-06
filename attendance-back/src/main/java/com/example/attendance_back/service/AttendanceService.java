package com.example.attendance_back.service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.attendance_back.dto.AttendanceDto;
import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.dto.RegisterAttendanceDto;
import com.example.attendance_back.repository.AttendanceRepository;
import com.example.attendance_back.repository.EmployeeRepository;

/**
 *
 * @author 芳末拓也
 *
 *         勤怠情報の取得と登録を行うサービスクラス
 */
@Service
public class AttendanceService {
	@Autowired
	private AttendanceRepository attendanceRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	/**
	 * 指定された年月の勤怠情報を取得するメソッド
	 *
	 * @param year
	 * @param month
	 * @return 指定された年月の勤怠情報のリスト
	 */
	public List<AttendanceDto> getAttendance(Integer year, Integer month) {
		// 現在ログインしているユーザー情報を取得
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		// メールアドレスから従業員IDを取得
		EmployeeDto employee = employeeRepository.findByEmail(email);
		Integer employeeid = employee.getEmployeeid();

		return attendanceRepository.findByEmployeeidAndYearAndMonth(employeeid, year, month);
	}

	/**
	 * 勤怠情報を登録または更新を行うメソッド
	 *
	 * @param registerAttendanceDto
	 */
	public void register(RegisterAttendanceDto registerAttendanceDto) {
		// 現在ログインしているユーザー情報を取得
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		// メールアドレスから従業員IDを取得
		EmployeeDto employee = employeeRepository.findByEmail(email);
		Integer employeeid = employee.getEmployeeid();

		// 年月日のパラメータを取得
		Integer year = registerAttendanceDto.getYear();
		Integer month = registerAttendanceDto.getMonth();
		Integer day = registerAttendanceDto.getDay();

		// 年月日から存在するデータを取得
		AttendanceDto existingAttendance = attendanceRepository.findByEmployeeidAndYearAndMonthAndDay(employeeid, year,
				month, day);

		if (existingAttendance != null) {
			// 既存のレコードがある場合は更新
			existingAttendance.setStarttime(parseTime(registerAttendanceDto.getStarttime()));
			existingAttendance.setEndtime(parseTime(registerAttendanceDto.getEndtime()));
			existingAttendance.setBreaktime(parseTime(registerAttendanceDto.getBreaktime()));
			existingAttendance.setWorkinghours(parseTime(registerAttendanceDto.getWorkinghours()));
			existingAttendance.setEarlyhours(parseTime(registerAttendanceDto.getEarlyhours()));
			existingAttendance.setOvertimehours(parseTime(registerAttendanceDto.getOvertimehours()));
			existingAttendance.setNightandholidayworks(parseTime(registerAttendanceDto.getNightandholidayworks()));
			existingAttendance.setSummary(registerAttendanceDto.getSummary());
			existingAttendance.setMemo(registerAttendanceDto.getMemo());

			// 更新処理
			attendanceRepository.save(existingAttendance);
		} else {
			// なかったら新規作成
			AttendanceDto attendanceDto = new AttendanceDto();
			attendanceDto.setEmployeeid(employeeid);
			attendanceDto.setYear(year);
			attendanceDto.setMonth(month);
			attendanceDto.setDay(day);
			attendanceDto.setStarttime(parseTime(registerAttendanceDto.getStarttime()));
			attendanceDto.setEndtime(parseTime(registerAttendanceDto.getEndtime()));
			attendanceDto.setBreaktime(parseTime(registerAttendanceDto.getBreaktime()));
			attendanceDto.setWorkinghours(parseTime(registerAttendanceDto.getWorkinghours()));
			attendanceDto.setEarlyhours(parseTime(registerAttendanceDto.getEarlyhours()));
			attendanceDto.setOvertimehours(parseTime(registerAttendanceDto.getOvertimehours()));
			attendanceDto.setNightandholidayworks(parseTime(registerAttendanceDto.getNightandholidayworks()));
			attendanceDto.setSummary(registerAttendanceDto.getSummary());
			attendanceDto.setMemo(registerAttendanceDto.getMemo());

			// 新規作成
			attendanceRepository.save(attendanceDto);
		}
	}

	/**
	 * 文字列形式の時間をLocalTimeに変換するメソッド
	 *
	 * @param timeString
	 * @return 変換されたLocalTime型の時間
	 */
	private LocalTime parseTime(String timeString) {
		// 文字列で受け取った時間をH:mm形式にしてLocalTime型に変換する
		return LocalTime.parse(timeString, DateTimeFormatter.ofPattern("H:mm"));
	}
}
