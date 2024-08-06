package com.example.attendance_back.dto;

import java.sql.Date;

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
 *         データベースのsystemテーブルにマッピングされるシステム情報のエンティティクラス
 */
@Entity
@Getter
@Setter
@Table(name = "system")
public class SystemDto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "systemid")
	private Integer systemid;

	@Column(name = "editingperiod")
	private Date editingperiod;

}
