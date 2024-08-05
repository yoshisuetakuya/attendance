package com.example.attendance_back.dto;

import java.time.LocalTime;

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
 *         データベースのattendanceテーブルにマッピングされる勤怠情報のエンティティクラス
 */
@Entity
@Getter
@Setter
@Table(name = "attendance")
public class AttendanceDto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "attendanceid")
	private Integer attendanceid;

	@Column(name = "employeeid")
	private Integer employeeid;

	@Column(name = "year")
	private Integer year;

	@Column(name = "month")
	private Integer month;

	@Column(name = "day")
	private Integer day;

	@Column(name = "starttime")
	private LocalTime starttime;

	@Column(name = "endtime")
	private LocalTime endtime;

	@Column(name = "breaktime", columnDefinition = "interval")
	private LocalTime breaktime;

	@Column(name = "workinghours", columnDefinition = "interval")
	private LocalTime workinghours;

	@Column(name = "earlyhours", columnDefinition = "interval")
	private LocalTime earlyhours;

	@Column(name = "overtimehours", columnDefinition = "interval")
	private LocalTime overtimehours;

	@Column(name = "nightandholidayworks", columnDefinition = "interval")
	private LocalTime nightandholidayworks;

	@Column(name = "summary")
	private String summary;

	@Column(name = "memo")
	private String memo;

}
