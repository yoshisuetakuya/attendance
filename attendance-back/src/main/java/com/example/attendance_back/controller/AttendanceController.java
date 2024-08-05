package com.example.attendance_back.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_back.dto.AttendanceDto;
import com.example.attendance_back.dto.RegisterAttendanceDto;
import com.example.attendance_back.service.AttendanceService;

/**
 *
 * @author 芳末拓也
 *
 *         勤怠情報の取得と登録を行うコントローラクラス
 *
 */
@RestController
public class AttendanceController {
	@Autowired
	private AttendanceService attendanceService;

	/**
	 * 指定した年月の勤怠情報を取得するメソッド
	 *
	 * @param year
	 * @param month
	 * @return 指定した年月の勤怠情報のリスト
	 */
	@GetMapping("/getAttendance/{year}/{month}")
	public List<AttendanceDto> getAttendance(@PathVariable("year") Integer year, @PathVariable("month") Integer month) {
		return attendanceService.getAttendance(year, month);
	}

	/**
	 * 勤怠情報を登録するメソッド
	 *
	 * @param registerAttendancedto
	 */
	@PostMapping("/register")
	public void registerAttendance(@RequestBody RegisterAttendanceDto registerAttendancedto) {
		attendanceService.register(registerAttendancedto);
	}
}
