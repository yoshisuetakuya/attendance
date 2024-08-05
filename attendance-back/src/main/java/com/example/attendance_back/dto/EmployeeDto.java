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
 *         データベースのemployeeテーブルにマッピングされる従業員情報のエンティティクラス
 *
 */
@Entity
@Getter
@Setter
@Table(name = "employee")
public class EmployeeDto {
	// エンティティの主キーを指定。今回であれば "employeeId" カラムになる
	@Id
	// employeeIdを自動採番する
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	// カラムに名前を付与
	@Column(name = "employeeid")
	private Integer employeeid;

	@Column(name = "name")
	private String name;

	@Column(name = "email")
	private String email;

	@Column(name = "password")
	private String password;

}
