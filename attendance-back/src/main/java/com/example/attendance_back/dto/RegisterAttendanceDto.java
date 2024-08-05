package com.example.attendance_back.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author 芳末拓也
 *
 *         入力された勤怠情報を受け取るエンティティクラス
 */
@Entity
@Getter
@Setter
@Table(name = "attendance")
public class RegisterAttendanceDto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "attendanceid")
	private Integer attendanceid;

	@Column(name = "year")
	private Integer year;

	@Column(name = "month")
	private Integer month;

	@Column(name = "day")
	private Integer day;

	@Column(name = "starttime")
	private String starttime;

	@Column(name = "endtime")
	private String endtime;

	@Column(name = "breaktime")
	private String breaktime;

	@Column(name = "workinghours")
	private String workinghours;

	@Column(name = "earlyhours")
	private String earlyhours;

	@Column(name = "overtimehours")
	private String overtimehours;

	@Column(name = "nightandholidayworks")
	private String nightandholidayworks;

	@Column(name = "summary")
	private String summary;

	@Column(name = "memo")
	private String memo;

}
